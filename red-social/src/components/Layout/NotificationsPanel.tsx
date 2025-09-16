import React, { useEffect, useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Close,
  Notifications,
  Cake,
  PersonAdd,
  CardGiftcard,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { colors } from '../../theme';
import { NotificationService, Notification } from '../../services/notificationService';

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ open, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAvisos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await NotificationService.getAvisos();
      setNotifications(response.notifications);
    } catch (err) {
      console.error('Error al cargar avisos:', err);
      setError('Error al cargar los avisos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadAvisos();
    }
  }, [open]);

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await NotificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error('Error al eliminar aviso:', err);
      setError('Error al eliminar el aviso');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'birthday_reminder':
        return <Cake color="primary" />;
      case 'contact_request':
      case 'contact_deleted':
        return <PersonAdd color="success" />;
      case 'wish_reserved':
      case 'wish_cancelled':
      case 'wish_viewed':
      case 'wish_deleted_by_contact':
      case 'wish_added':
      case 'wish_modified':
        return <CardGiftcard color="secondary" />;
      case 'address_changed':
      case 'account_deleted':
      default:
        return <Notifications color="action" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const notificationDate = new Date(timestamp);
    const diff = now.getTime() - notificationDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `hace ${days} día${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
      return 'hace unos minutos';
    }
  };

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 400,
          maxWidth: '90vw',
          backgroundColor: colors.background.primary,
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${colors.border.light}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.background.secondary,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Notifications color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Avisos
            </Typography>
            {unreadCount > 0 && (
              <Chip
                label={unreadCount}
                size="small"
                color="primary"
                sx={{ ml: 1 }}
              />
            )}
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        {/* Notifications List */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', py: 4 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ ml: 2, color: colors.text.secondary }}>
                Cargando avisos...
              </Typography>
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="error">{error}</Typography>
            </Box>
          ) : !notifications || notifications.length === 0 ? (
            <Box
              sx={{
                p: 4,
                textAlign: 'center',
                color: colors.text.tertiary,
              }}
            >
              <Notifications sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
              <Typography variant="body1">
                No tienes avisos
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {notifications?.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      py: 2,
                      px: 2,
                      backgroundColor: notification.isRead 
                        ? 'transparent' 
                        : colors.background.secondary,
                      borderLeft: notification.isRead 
                        ? 'none' 
                        : `3px solid ${colors.primary[500]}`,
                      '&:hover': {
                        backgroundColor: colors.background.secondary,
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          backgroundColor: notification.isRead 
                            ? colors.background.tertiary 
                            : colors.primary[200],
                          color: notification.isRead 
                            ? colors.text.tertiary 
                            : colors.primary[500],
                        }}
                      >
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: notification.isRead ? 400 : 600,
                            color: colors.text.primary,
                          }}
                        >
                          {notification.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: colors.text.secondary,
                              mb: 0.5,
                            }}
                          >
                            {notification.message}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography
                              variant="caption"
                              sx={{
                                color: colors.text.tertiary,
                                fontSize: '0.75rem',
                              }}
                            >
                              {formatTimestamp(notification.createdAt)}
                            </Typography>
                            <Button
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteNotification(notification.id)}
                              sx={{ 
                                color: colors.error?.[600] || '#d32f2f', 
                                fontSize: '0.75rem',
                                minWidth: 'auto',
                                p: 0.5
                              }}
                              size="small"
                            >
                              Descartar
                            </Button>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < (notifications?.length || 0) - 1 && (
                    <Divider sx={{ mx: 2 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${colors.border.light}`,
            backgroundColor: colors.background.secondary,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: colors.text.tertiary,
              textAlign: 'center',
              display: 'block',
            }}
          >
            Los avisos también se envían a tu email
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default NotificationsPanel;
