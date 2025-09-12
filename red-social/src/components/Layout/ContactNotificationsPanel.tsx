import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { colors } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ContactInvitation {
  id: string;
  userId: string;
  contactId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  user: {
    id: string;
    nickname: string;
    profileImage?: string;
    realName: string;
  };
}

interface ContactNotificationsPanelProps {
  open: boolean;
  onClose: () => void;
  onContactAccepted?: () => void; // Callback para notificar cuando se acepta un contacto
}

const ContactNotificationsPanel: React.FC<ContactNotificationsPanelProps> = ({
  open,
  onClose,
  onContactAccepted,
}) => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<ContactInvitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [responding, setResponding] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  // Cargar invitaciones pendientes
  const loadPendingInvitations = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:3001/api/contact-notifications/pending', {
        headers: {
          'Authorization': `Bearer ${state.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar invitaciones');
      }

      const data = await response.json();
      setInvitations(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar invitaciones');
    } finally {
      setLoading(false);
    }
  };

  // Responder a una invitación
  const respondToInvitation = async (invitationId: string, response: 'accepted' | 'rejected') => {
    try {
      setResponding(invitationId);
      setError('');

      const invitation = invitations.find(inv => inv.id === invitationId);
      if (!invitation) return;

      const res = await fetch('http://localhost:3001/api/contact-notifications/respond', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${state.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactId: invitation.userId,
          response: response,
        }),
      });

      if (!res.ok) {
        throw new Error('Error al responder invitación');
      }

      // Remover la invitación de la lista
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      
      // Notificar al componente padre si se aceptó la invitación
      if (response === 'accepted') {
        if (onContactAccepted) {
          onContactAccepted();
        }
        // Disparar evento personalizado para recargar contactos
        window.dispatchEvent(new CustomEvent('reloadContacts'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al responder invitación');
    } finally {
      setResponding(null);
    }
  };

  // Ver perfil del usuario
  const viewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
    onClose();
  };

  // Cargar invitaciones cuando se abre el panel
  useEffect(() => {
    if (open) {
      loadPendingInvitations();
    }
  }, [open]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
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
          <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 600 }}>
            Invitaciones de Contacto
          </Typography>
          <IconButton onClick={onClose} size="small">
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

        {/* Lista de invitaciones */}
        {!loading && invitations.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <PersonAddIcon sx={{ fontSize: 48, color: colors.text.tertiary, mb: 1 }} />
            <Typography variant="body2" sx={{ color: colors.text.tertiary }}>
              No tienes invitaciones pendientes
            </Typography>
          </Box>
        )}

        {!loading && invitations.length > 0 && (
          <List sx={{ p: 0 }}>
            {invitations.map((invitation, index) => (
              <React.Fragment key={invitation.id}>
                <ListItem sx={{ px: 0, py: 2 }}>
                  <ListItemAvatar>
                    <Avatar
                      src={invitation.user.profileImage}
                      sx={{
                        width: 48,
                        height: 48,
                        border: `2px solid ${colors.primary[200]}`,
                      }}
                    >
                      {invitation.user.nickname.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: colors.text.primary,
                          fontWeight: 600,
                          cursor: 'pointer',
                          '&:hover': {
                            color: colors.primary[500],
                            textDecoration: 'underline',
                          },
                        }}
                        onClick={() => viewProfile(invitation.user.id)}
                      >
                        {invitation.user.nickname}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>
                          {invitation.user.realName}
                        </Typography>
                        <Chip
                          label="Invitación pendiente"
                          size="small"
                          sx={{
                            backgroundColor: colors.primary[100],
                            color: colors.primary[700],
                            fontSize: '0.75rem',
                          }}
                        />
                      </Box>
                    }
                  />

                  {/* Botones de respuesta */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => respondToInvitation(invitation.id, 'accepted')}
                      disabled={responding === invitation.id}
                      sx={{
                        backgroundColor: colors.status.success,
                        '&:hover': {
                          backgroundColor: colors.status.success,
                          opacity: 0.9,
                        },
                        minWidth: 'auto',
                        px: 2,
                      }}
                    >
                      {responding === invitation.id ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        'Aceptar'
                      )}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<CancelIcon />}
                      onClick={() => respondToInvitation(invitation.id, 'rejected')}
                      disabled={responding === invitation.id}
                      sx={{
                        borderColor: colors.status.error,
                        color: colors.status.error,
                        '&:hover': {
                          borderColor: colors.status.error,
                          backgroundColor: colors.status.error,
                          color: 'white',
                        },
                        minWidth: 'auto',
                        px: 2,
                      }}
                    >
                      Rechazar
                    </Button>
                  </Box>
                </ListItem>
                
                {index < invitations.length - 1 && (
                  <Divider sx={{ my: 1 }} />
                )}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default ContactNotificationsPanel;
