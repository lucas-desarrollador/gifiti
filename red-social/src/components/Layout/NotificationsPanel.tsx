import React from 'react';
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
} from '@mui/material';
import {
  Close,
  Notifications,
  Cake,
  PersonAdd,
  CardGiftcard,
} from '@mui/icons-material';
import { colors } from '../../theme';

interface Notification {
  id: string;
  type: 'birthday' | 'contact' | 'wish' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  avatar?: string;
}

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ open, onClose }) => {
  // Datos de prueba - en el futuro vendrán de la API
  // NOTA: Las notificaciones de cumpleaños ahora se manejan en BirthdayNotificationsBell
  const notifications: Notification[] = [
    {
      id: '2',
      type: 'contact',
      title: 'Nuevo contacto',
      message: 'Juan te agregó como contacto',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 horas atrás
      read: false,
    },
    {
      id: '3',
      type: 'wish',
      title: 'Nuevo deseo',
      message: 'Ana agregó un nuevo deseo',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 día atrás
      read: true,
    },
    {
      id: '4',
      type: 'system',
      title: 'Bienvenido a GiFiTi',
      message: 'Tu cuenta ha sido creada exitosamente',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
      read: true,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'birthday':
        return <Cake color="primary" />;
      case 'contact':
        return <PersonAdd color="success" />;
      case 'wish':
        return <CardGiftcard color="secondary" />;
      default:
        return <Notifications color="action" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
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

  const unreadCount = notifications.filter(n => !n.read).length;

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
              Notificaciones
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
          {notifications.length === 0 ? (
            <Box
              sx={{
                p: 4,
                textAlign: 'center',
                color: colors.text.tertiary,
              }}
            >
              <Notifications sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
              <Typography variant="body1">
                No tienes notificaciones
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      py: 2,
                      px: 2,
                      backgroundColor: notification.read 
                        ? 'transparent' 
                        : colors.background.secondary,
                      borderLeft: notification.read 
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
                          backgroundColor: notification.read 
                            ? colors.background.tertiary 
                            : colors.primary[200],
                          color: notification.read 
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
                            fontWeight: notification.read ? 400 : 600,
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
                          <Typography
                            variant="caption"
                            sx={{
                              color: colors.text.tertiary,
                              fontSize: '0.75rem',
                            }}
                          >
                            {formatTimestamp(notification.timestamp)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < notifications.length - 1 && (
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
            Las notificaciones también se envían a tu email
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default NotificationsPanel;
