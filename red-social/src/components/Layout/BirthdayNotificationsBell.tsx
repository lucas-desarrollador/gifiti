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
} from '@mui/material';
import {
  Notifications as BellIcon,
  Close as CloseIcon,
  Cake as CakeIcon,
  CheckCircle as MarkReadIcon,
} from '@mui/icons-material';
import { colors } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { getProfileImageUrl } from '../../utils/imageUtils';

interface BirthdayNotification {
  id: string;
  contactId: string;
  contactName: string;
  contactNickname: string;
  contactImage?: string;
  birthdayDate: string;
  daysUntil: number;
  read: boolean;
  createdAt: string;
}

interface BirthdayNotificationsBellProps {
  // Props opcionales para personalización
}

const BirthdayNotificationsBell: React.FC<BirthdayNotificationsBellProps> = () => {
  console.log('🎂 BirthdayNotificationsBell - Componente montado');
  
  const { state } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<BirthdayNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [hasLoaded, setHasLoaded] = useState(false);


  // Cargar notificaciones de cumpleaños
  const loadBirthdayNotifications = async () => {
    try {
      console.log('🎂 Cargando notificaciones de cumpleaños...');
      setLoading(true);
      setError('');
      
      // Obtener la configuración de días de anticipación del usuario
      const savedAnticipation = localStorage.getItem(`anticipation_${state.user?.id}`);
      const daysAhead = savedAnticipation ? parseInt(savedAnticipation) : 30; // Por defecto 30 días
      
      console.log('🎂 Días de anticipación:', daysAhead);
      
      const response = await fetch(`http://localhost:3001/api/birthday-notifications?daysAhead=${daysAhead}`, {
        headers: {
          'Authorization': `Bearer ${state.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar notificaciones de cumpleaños');
      }

      const data = await response.json();
      
      console.log('🎂 Respuesta del servidor:', data);
      
      if (data.success) {
        // Obtener notificaciones marcadas como leídas del localStorage
        const readNotifications = JSON.parse(localStorage.getItem(`readBirthdayNotifications_${state.user?.id}`) || '[]');
        
        // Marcar como leídas las notificaciones que están en localStorage
        const notificationsWithReadStatus = data.data.map((notification: any) => ({
          ...notification,
          read: readNotifications.includes(notification.id)
        }));
        
        setNotifications(notificationsWithReadStatus);
        setHasLoaded(true);
        console.log('🎂 Notificaciones cargadas:', notificationsWithReadStatus.length);
      } else {
        throw new Error(data.message || 'Error al cargar notificaciones');
      }
    } catch (err) {
      console.error('🎂 Error al cargar notificaciones:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  };

  // Marcar notificación como leída
  const markAsRead = async (notificationId: string) => {
    try {
      console.log('🎂 BirthdayNotificationsBell - Marcando como leída:', notificationId);
      setMarkingAsRead(notificationId);
      
      // Obtener notificaciones marcadas como leídas del localStorage
      const readNotifications = JSON.parse(localStorage.getItem(`readBirthdayNotifications_${state.user?.id}`) || '[]');
      
      // Agregar esta notificación a la lista de leídas
      if (!readNotifications.includes(notificationId)) {
        readNotifications.push(notificationId);
        localStorage.setItem(`readBirthdayNotifications_${state.user?.id}`, JSON.stringify(readNotifications));
      }

      // Actualizar estado local
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
      
      console.log('🎂 BirthdayNotificationsBell - Estado actualizado correctamente');
      
      // Limpiar cualquier error previo
      setError('');
    } catch (err) {
      console.error('🎂 BirthdayNotificationsBell - Error al marcar como leída:', err);
      setError(err instanceof Error ? err.message : 'Error al marcar como leída');
    } finally {
      setMarkingAsRead(null);
    }
  };

  // Revertir notificación (marcar como no leída)
  const markAsUnread = async (notificationId: string) => {
    try {
      setMarkingAsRead(notificationId);
      
      // Obtener notificaciones marcadas como leídas del localStorage
      const readNotifications = JSON.parse(localStorage.getItem(`readBirthdayNotifications_${state.user?.id}`) || '[]');
      
      // Remover esta notificación de la lista de leídas
      const updatedReadNotifications = readNotifications.filter((id: string) => id !== notificationId);
      localStorage.setItem(`readBirthdayNotifications_${state.user?.id}`, JSON.stringify(updatedReadNotifications));

      // Actualizar estado local
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: false }
            : notif
        )
      );
      
      // El contador se actualiza automáticamente con el filtro de unreadCount
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al revertir notificación');
    } finally {
      setMarkingAsRead(null);
    }
  };


  // Contar notificaciones no leídas (solo si se han cargado las notificaciones)
  const unreadCount = hasLoaded ? notifications.filter(n => !n.read).length : 0;
  
  // Debug: Log para ver qué está pasando
  console.log('🎂 BirthdayNotificationsBell - Estado:', {
    hasLoaded,
    notificationsCount: notifications.length,
    unreadCount,
    open,
    notifications: notifications.map(n => ({ id: n.id, read: n.read, contactName: n.contactName }))
  });

  // Cargar notificaciones al montar el componente (solo una vez)
  useEffect(() => {
    if (state.user?.id && !hasLoaded) {
      loadBirthdayNotifications();
    }
  }, [state.user?.id, hasLoaded]);

  // Recargar notificaciones cuando se abre el panel
  useEffect(() => {
    if (open) {
      loadBirthdayNotifications();
    }
  }, [open]); // Recargar cuando cambie el usuario o se abra el panel

  // Solo cargar notificaciones cuando se abra el panel para evitar contadores incorrectos
  // useEffect(() => {
  //   loadBirthdayNotifications();
  // }, []);

  // Escuchar cambios en localStorage para recargar notificaciones (solo si el panel está abierto)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `anticipation_${state.user?.id}` && e.newValue && open) {
        loadBirthdayNotifications();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [state.user?.id, open]);

  return (
    <>
      {/* Campanita con contador */}
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          color: colors.text.primary,
          '&:hover': {
            backgroundColor: colors.primary[100],
          },
        }}
      >
        <Badge
          badgeContent={unreadCount > 0 ? unreadCount : null}
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: colors.status.error,
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 600,
              minWidth: '18px',
              height: '18px',
            },
          }}
        >
          <CakeIcon />
        </Badge>
      </IconButton>

      {/* Panel de notificaciones de cumpleaños */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 },
            backgroundColor: colors.background.card,
            border: `1px solid ${colors.border.light}`,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CakeIcon sx={{ color: colors.primary[500] }} />
              <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 600 }}>
                Cumpleaños Próximos
              </Typography>
              {unreadCount > 0 && (
                <Chip
                  label={unreadCount}
                  size="small"
                  sx={{
                    backgroundColor: colors.status.error,
                    color: 'white',
                    fontSize: '0.75rem',
                  }}
                />
              )}
            </Box>
            <IconButton onClick={() => setOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Error */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}


          {/* Loading */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={40} />
            </Box>
          )}

          {/* Lista de notificaciones */}
          {!loading && notifications.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CakeIcon sx={{ fontSize: 48, color: colors.text.tertiary, mb: 1 }} />
              <Typography variant="body2" sx={{ color: colors.text.tertiary }}>
                No hay cumpleaños próximos
              </Typography>
            </Box>
          )}

          {!loading && notifications.length > 0 && (
            <List sx={{ p: 0 }}>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      px: 0,
                      py: 2,
                      backgroundColor: notification.read 
                        ? 'transparent' 
                        : colors.background.secondary,
                      borderLeft: notification.read 
                        ? 'none' 
                        : `3px solid ${colors.primary[500]}`,
                      borderRadius: 1,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={getProfileImageUrl(notification.contactImage)}
                        sx={{
                          width: 48,
                          height: 48,
                          border: `2px solid ${colors.primary[200]}`,
                        }}
                      >
                        {notification.contactNickname.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={notification.contactName}
                      primaryTypographyProps={{
                        variant: 'subtitle1',
                        component: 'span',
                        sx: {
                          color: colors.text.primary,
                          fontWeight: notification.read ? 400 : 600,
                        }
                      }}
                      secondary={
                        <Box>
                          <Typography variant="body2" component="span" sx={{ color: colors.text.secondary, mb: 1, display: 'block' }}>
                            {notification.contactNickname}
                          </Typography>
                          <Chip
                            label={`Cumple en ${notification.daysUntil} día${notification.daysUntil > 1 ? 's' : ''}`}
                            size="small"
                            sx={{
                              backgroundColor: notification.read 
                                ? colors.background.tertiary 
                                : colors.primary[100],
                              color: notification.read 
                                ? colors.text.tertiary 
                                : colors.primary[700],
                              fontSize: '0.75rem',
                            }}
                          />
                        </Box>
                      }
                    />

                    {/* Botones de acción */}
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      {!notification.read ? (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<MarkReadIcon />}
                          onClick={() => markAsRead(notification.id)}
                          disabled={markingAsRead === notification.id}
                          sx={{
                            borderColor: colors.primary[500],
                            color: colors.primary[500],
                            '&:hover': {
                              borderColor: colors.primary[600],
                              backgroundColor: colors.primary[50],
                            },
                            minWidth: 'auto',
                            px: 2,
                          }}
                        >
                          {markingAsRead === notification.id ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            'Marcar'
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<MarkReadIcon />}
                          onClick={() => markAsUnread(notification.id)}
                          disabled={markingAsRead === notification.id}
                          sx={{
                            borderColor: colors.primary[500],
                            color: colors.primary[500],
                            '&:hover': {
                              borderColor: colors.primary[600],
                              backgroundColor: colors.primary[50],
                            },
                            minWidth: 'auto',
                            px: 2,
                          }}
                        >
                          {markingAsRead === notification.id ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            'Revertir'
                          )}
                        </Button>
                      )}
                    </Box>
                  </ListItem>
                  
                  {index < notifications.length - 1 && (
                    <Divider sx={{ my: 1 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default BirthdayNotificationsBell;
