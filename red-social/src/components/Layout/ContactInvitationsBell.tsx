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
  Button,
  Alert,
  CircularProgress,
  ButtonGroup,
} from '@mui/material';
import {
  Close as CloseIcon,
  PersonAdd as ContactIcon,
  Check as AcceptIcon,
  Close as RejectIcon,
} from '@mui/icons-material';
import { colors } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { getProfileImageUrl } from '../../utils/imageUtils';
import { ContactService } from '../../services/contactService';

interface ContactInvitation {
  id: string;
  userId: string;
  contactId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  user?: {
    id: string;
    nickname: string;
    realName: string;
    profileImage?: string;
  };
}

const ContactInvitationsBell: React.FC = () => {
  const { state } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [invitations, setInvitations] = useState<ContactInvitation[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Cargar invitaciones pendientes
  const loadPendingInvitations = async () => {
    if (!state.user) return;
    
    setLoading(true);
    try {
      const response = await ContactService.getPendingInvitations();
      setInvitations(response.invitations || []);
      setUnreadCount(response.invitations?.length || 0);
    } catch (err) {
      console.error('Error al cargar invitaciones pendientes:', err);
      setError('Error al cargar invitaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingInvitations();
  }, [state.user]);

  // Formatear tiempo
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays}d`;
  };

  // Aceptar invitación
  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      console.log('🔍 Frontend - Aceptando invitación:', invitationId);
      const response = await ContactService.acceptInvitation(invitationId);
      console.log('✅ Frontend - Respuesta del servicio:', response);
      console.log('🔍 Frontend - Contacto en la respuesta:', response.contact);
      
      // Actualizar estado local
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Emitir evento personalizado para notificar que se aceptó una invitación
      try {
        const event = new CustomEvent('contactInvitationAccepted', {
          detail: { contact: response.contact }
        });
        console.log('📡 Frontend - Emitiendo evento:', event.detail);
        console.log('📡 Frontend - Estructura del evento:', {
          type: event.type,
          detail: event.detail,
          contact: event.detail.contact
        });
        window.dispatchEvent(event);
        console.log('✅ Frontend - Evento emitido exitosamente');
        
        // No recargar automáticamente ya que el contacto se agregó localmente
        console.log('✅ Frontend - Contacto agregado localmente, no se necesita recarga');
      } catch (eventError) {
        console.error('❌ Frontend - Error al emitir evento:', eventError);
      }
    } catch (error) {
      console.error('❌ Frontend - Error al aceptar invitación:', error);
    }
  };

  // Rechazar invitación
  const handleRejectInvitation = async (invitationId: string) => {
    try {
      await ContactService.rejectInvitation(invitationId);
      
      // Actualizar estado local
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error al rechazar invitación:', error);
    }
  };


  return (
    <>
      <IconButton
        onClick={() => setIsDrawerOpen(true)}
        sx={{ color: colors.text.primary }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <ContactIcon />
        </Badge>
      </IconButton>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 400,
            backgroundColor: colors.background.primary,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 600 }}>
              Invitaciones de Contacto
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
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : invitations.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <ContactIcon sx={{ fontSize: 48, color: colors.text.tertiary, mb: 2 }} />
              <Typography variant="body2" sx={{ color: colors.text.tertiary }}>
                No hay invitaciones pendientes
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {invitations.map((invitation, index) => (
                <React.Fragment key={invitation.id}>
                  <ListItem
                    sx={{
                      backgroundColor: colors.primary?.[50] || '#f0fdfa',
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': {
                        backgroundColor: colors.background.secondary,
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={invitation.user?.profileImage 
                          ? getProfileImageUrl(invitation.user.profileImage) 
                          : undefined}
                        sx={{
                          backgroundColor: colors.primary?.[500] || '#0d9488',
                          width: 40,
                          height: 40,
                        }}
                      >
                        {invitation.user?.nickname?.charAt(0).toUpperCase() || '?'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={invitation.user?.realName || invitation.user?.nickname || 'Usuario desconocido'}
                      primaryTypographyProps={{
                        variant: 'subtitle2',
                        sx: {
                          color: colors.text.primary,
                          fontWeight: 600,
                          mb: 0.5,
                        }
                      }}
                      secondary={
                        <Box>
                          <Typography variant="body2" component="span" sx={{ color: colors.text.secondary, mb: 1, display: 'block' }}>
                            Te ha enviado una invitación de contacto
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" component="span" sx={{ color: colors.text.tertiary }}>
                              {formatTimeAgo(invitation.createdAt)}
                            </Typography>
                            <ButtonGroup size="small" variant="text">
                              <Button
                                startIcon={<AcceptIcon />}
                                onClick={() => handleAcceptInvitation(invitation.id)}
                                sx={{ color: colors.success?.[600] || '#10b981', fontSize: '0.75rem' }}
                              >
                                ACEPTAR
                              </Button>
                              <Button
                                startIcon={<RejectIcon />}
                                onClick={() => handleRejectInvitation(invitation.id)}
                                sx={{ color: colors.error?.[600] || '#d32f2f', fontSize: '0.75rem' }}
                              >
                                RECHAZAR
                              </Button>
                            </ButtonGroup>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < invitations.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Drawer>

    </>
  );
};

export default ContactInvitationsBell;
