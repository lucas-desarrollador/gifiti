import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  Button,
  Alert,
  CircularProgress,
  ButtonGroup,
} from '@mui/material';
import {
  Close as CloseIcon,
  Cake as CakeIcon,
  CheckCircle as MarkReadIcon,
  CardGiftcard as GiftIcon,
  Visibility as ViewIcon,
  Delete as IgnoreIcon,
} from '@mui/icons-material';
import { colors } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { getProfileImageUrl } from '../../utils/imageUtils';
import { NotificationService, Notification } from '../../services/notificationService';

// Solo manejar notificaciones de reservas, no cumpleaños

const NotificationsBell: React.FC = () => {
  const { state } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // Removido: birthdayNotifications - solo manejar notificaciones de reservas
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [revealedNotifications, setRevealedNotifications] = useState<Set<string>>(new Set());
  const [ignoredNotifications, setIgnoredNotifications] = useState<Set<string>>(new Set());

  // Cargar notificaciones
  const loadNotifications = async () => {
    if (!state.user) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Cargar notificaciones del sistema
      const notificationsData = await NotificationService.getNotifications(1, 50);
      setNotifications(notificationsData.notifications);
      
      // Cargar contador de no leídas
      const countData = await NotificationService.getUnreadCount();
      setUnreadCount(countData.count);
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
      setError('Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  };

  // Función eliminada: cleanupExampleNotifications

  useEffect(() => {
    loadNotifications();
  }, [state.user]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      // Primero revelar la información
      handleRevealReserver(notificationId);
      
      // Luego marcar como leída
      await NotificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error al marcar como leída:', err);
    }
  };

  const handleIgnore = async (notificationId: string) => {
    try {
      // Marcar como ignorada (no eliminar)
      setIgnoredNotifications(prev => new Set(prev).add(notificationId));
      
      // Marcar como leída para quitar el contador
      await NotificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error al ignorar notificación:', err);
    }
  };

  // Función eliminada: handleMarkAllAsRead

  // Revelar información del reservador
  const handleRevealReserver = (notificationId: string) => {
    setRevealedNotifications(prev => new Set(prev).add(notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'wish_reserved':
        return <GiftIcon sx={{ color: colors.primary?.[500] || '#14b8a6' }} />;
      case 'wish_cancelled':
        return <GiftIcon sx={{ color: colors.error?.[500] || '#f44336' }} />;
      case 'contact_request':
        return <GiftIcon sx={{ color: colors.primary?.[500] || '#14b8a6' }} />;
      case 'birthday_reminder':
        return <CakeIcon sx={{ color: colors.primary?.[500] || '#14b8a6' }} />;
      default:
        return <GiftIcon sx={{ color: colors.primary?.[500] || '#14b8a6' }} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'wish_reserved':
        return colors.success?.[500] || '#4caf50';
      case 'wish_cancelled':
        return colors.error?.[500] || '#f44336';
      case 'contact_request':
        return colors.primary?.[500] || '#14b8a6';
      case 'birthday_reminder':
        return colors.primary?.[500] || '#14b8a6';
      default:
        return colors.primary?.[500] || '#14b8a6';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`;
    return `Hace ${Math.floor(diffInMinutes / 1440)}d`;
  };

  // Solo notificaciones de reservas, ordenadas por fecha
  const allNotifications = notifications
    .filter(notif => notif.type === 'wish_reserved' || notif.type === 'wish_cancelled')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalUnreadCount = unreadCount;

  return (
    <>
      <IconButton
        onClick={() => setIsDrawerOpen(true)}
        sx={{
          color: colors.text.primary,
          '&:hover': {
            backgroundColor: colors.background.secondary,
          },
        }}
      >
        <Badge badgeContent={totalUnreadCount} color="error">
          <GiftIcon />
        </Badge>
      </IconButton>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 400,
            backgroundColor: colors.background.primary,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 600 }}>
              Notificaciones
            </Typography>
            <IconButton
              onClick={() => setIsDrawerOpen(false)}
              size="small"
              sx={{ color: colors.text.secondary }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : allNotifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <GiftIcon sx={{ fontSize: 48, color: colors.text.tertiary, mb: 1 }} />
              <Typography variant="body2" sx={{ color: colors.text.tertiary }}>
                No tienes notificaciones
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {allNotifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      backgroundColor: notification.isRead ? 'transparent' : colors.primary?.[50] || '#f0fdfa',
                      borderRadius: 1,
                      mb: 1,
                      opacity: ignoredNotifications.has(notification.id) ? 0.7 : 1,
                      border: ignoredNotifications.has(notification.id) ? `1px solid ${colors.border.light}` : 'none',
                      '&:hover': {
                        backgroundColor: colors.background.secondary,
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={revealedNotifications.has(notification.id) && !ignoredNotifications.has(notification.id) && notification.relatedUser?.profileImage 
                          ? getProfileImageUrl(notification.relatedUser.profileImage) 
                          : undefined}
                        sx={{
                          backgroundColor: getNotificationColor(notification.type),
                          width: 40,
                          height: 40,
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
                            color: colors.text.primary,
                            fontWeight: notification.isRead ? 400 : 600,
                            mb: 0.5,
                          }}
                        >
                          {notification.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>
                            {revealedNotifications.has(notification.id) 
                              ? notification.message 
                              : `Alguien ha reservado tu deseo "${notification.relatedWish?.title || 'deseo'}"`
                            }
                          </Typography>
                          {ignoredNotifications.has(notification.id) && (
                            <Typography variant="caption" sx={{ color: colors.text.tertiary, fontStyle: 'italic' }}>
                              Reserva confirmada - Se mantendrá hasta la fecha del cumpleaños
                            </Typography>
                          )}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ color: colors.text.tertiary }}>
                              {formatTimeAgo(notification.createdAt)}
                            </Typography>
                            {!notification.isRead && !ignoredNotifications.has(notification.id) && (
                              <ButtonGroup size="small" variant="text">
                                <Button
                                  startIcon={<ViewIcon />}
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  sx={{ color: colors.primary?.[600] || '#0d9488', fontSize: '0.75rem' }}
                                >
                                  VER
                                </Button>
                                <Button
                                  startIcon={<IgnoreIcon />}
                                  onClick={() => handleIgnore(notification.id)}
                                  sx={{ color: colors.error?.[600] || '#d32f2f', fontSize: '0.75rem' }}
                                >
                                  IGNORAR
                                </Button>
                              </ButtonGroup>
                            )}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < allNotifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default NotificationsBell;
