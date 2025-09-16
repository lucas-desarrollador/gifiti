import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Avatar,
  Grid,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  CardGiftcard as GiftIcon,
} from '@mui/icons-material';
import { colors } from '../../theme';
import { getProfileImageUrl } from '../../utils/imageUtils';
import { formatDateToSpanish, getDaysUntilBirthday } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';

interface ContactProfile {
  id: string;
  nickname: string;
  realName: string;
  profileImage?: string;
  birthDate: string;
  age: number;
  address?: string;
  votes: number;
  wishesCount: number;
  wishes: Array<{
    id: string;
    title: string;
    position: number;
  }>;
  isPublic: {
    profile: boolean;
    wishes: boolean;
  };
}

interface ContactProfileModalProps {
  open: boolean;
  onClose: () => void;
  contactId: string;
  contactName: string;
  onViewContacts: (contactId: string) => void;
  onViewMutualFriends: (contactId: string) => void;
  onViewWishes: (contactId: string) => void;
}

const ContactProfileModal: React.FC<ContactProfileModalProps> = ({
  open,
  onClose,
  contactId,
  contactName,
  onViewContacts,
  onViewMutualFriends,
  onViewWishes,
}) => {
  const { state } = useAuth();
  const [contact, setContact] = useState<ContactProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const loadContactProfile = async () => {
    if (!contactId || !state.token) return;

    console.log('🔍 ContactProfileModal - Cargando perfil:', { contactId });
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `http://localhost:3001/api/contact-profile/${contactId}`,
        {
          headers: {
            'Authorization': `Bearer ${state.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('📡 ContactProfileModal - Respuesta:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ ContactProfileModal - Error:', errorText);
        throw new Error('Error al cargar el perfil del contacto');
      }

      const data = await response.json();
      setContact(data.data);
    } catch (err) {
      console.error('Error al cargar perfil:', err);
      setError('Error al cargar el perfil del contacto');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && contactId) {
      loadContactProfile();
    }
  }, [open, contactId, state.token]);

  if (!contact && !loading && !error) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: colors.background.primary,
          borderRadius: 2,
        },
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        p: 2, 
        pb: 1,
        borderBottom: `1px solid ${colors.border.primary}`
      }}>
        <GiftIcon sx={{ color: colors.primary[500] }} />
        <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 600 }}>
          Perfil de Contacto
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton
          onClick={onClose}
          sx={{
            color: colors.text.secondary,
            '&:hover': {
              backgroundColor: colors.background.secondary,
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 2 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: colors.primary[500] }} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && contact && (
          <>
            {/* Información del contacto */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={getProfileImageUrl(contact.profileImage)}
                  sx={{
                    width: 120,
                    height: 120,
                    margin: '0 auto 16px',
                    border: `3px solid ${colors.primary[200]}`,
                    boxShadow: '0 4px 12px rgba(20, 184, 166, 0.15)',
                  }}
                >
                  {contact.nickname.charAt(0).toUpperCase()}
                </Avatar>
                
                {/* Iconos de reputación */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 10,
                    left: -10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: colors.background.card,
                    padding: '4px 8px',
                    borderRadius: 2,
                    border: `1px solid ${colors.border.light}`,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Typography variant="body2" sx={{ color: colors.primary[600], fontWeight: 600 }}>
                    🎁 {contact.votes || 0}
                  </Typography>
                </Box>
                
                {/* Icono de corazón (solo si hay votos negativos) */}
                {contact.votes < 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 10,
                      right: -10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      backgroundColor: colors.background.card,
                      padding: '4px 8px',
                      borderRadius: 2,
                      border: `1px solid ${colors.border.light}`,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: colors.error[600], fontWeight: 600 }}>
                      ❤️ {Math.abs(contact.votes)}
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Typography variant="h5" sx={{ color: colors.text.primary, fontWeight: 600, mb: 0.5 }}>
                {contact.realName}
              </Typography>
              
              <Typography variant="body1" sx={{ color: colors.text.secondary, mb: 2 }}>
                @{contact.nickname}
              </Typography>

              {/* Fecha de nacimiento y edad */}
              <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>
                📅 {formatDateToSpanish(contact.birthDate)} • {contact.age} años
              </Typography>

              {/* Días hasta el cumpleaños */}
              <Typography variant="body2" sx={{ color: colors.primary[600], fontWeight: 500 }}>
                🎂 Cumple en {getDaysUntilBirthday(contact.birthDate)} días
              </Typography>

              {/* Email - solo si está habilitado en configuración */}
              {contact.email && (
                <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 1 }}>
                  📧 {contact.email}
                </Typography>
              )}
            </Box>


            {/* Lista de deseos */}
            {contact.wishes.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: colors.text.primary, mb: 2, fontWeight: 600 }}>
                  Sus Deseos ({contact.isPublic.wishes ? contact.wishesCount : 1})
                </Typography>
                <Box sx={{ pl: 0 }}>
                  {/* Si showAllWishes está habilitado, mostrar hasta 5 deseos */}
                  {contact.isPublic.wishes ? (
                    <>
                      {contact.wishes.slice(0, 5).map((wish) => (
                        <Box key={wish.id} sx={{ py: 0.5, px: 0 }}>
                          <Typography variant="body2" sx={{ color: colors.text.primary }}>
                            #{wish.position} {wish.title}
                          </Typography>
                        </Box>
                      ))}
                      {contact.wishes.length > 5 && (
                        <Box sx={{ py: 0.5, px: 0 }}>
                          <Typography variant="body2" sx={{ color: colors.text.tertiary, fontStyle: 'italic' }}>
                            ... y {contact.wishes.length - 5} más
                          </Typography>
                        </Box>
                      )}
                    </>
                  ) : (
                    /* Si showAllWishes está deshabilitado, mostrar solo el #1 */
                    <Box sx={{ py: 0.5, px: 0 }}>
                      <Typography variant="body2" sx={{ color: colors.text.primary }}>
                        #{contact.wishes[0].position} {contact.wishes[0].title}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Botones de acción */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<PeopleIcon />}
                  onClick={() => onViewContacts(contact.id)}
                  sx={{
                    borderColor: colors.primary[500],
                    color: colors.primary[500],
                    '&:hover': {
                      borderColor: colors.primary[600],
                      backgroundColor: colors.primary[50],
                    },
                  }}
                >
                  Sus Contactos
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<PersonAddIcon />}
                  onClick={() => onViewMutualFriends(contact.id)}
                  sx={{
                    borderColor: colors.primary[500],
                    color: colors.primary[500],
                    '&:hover': {
                      borderColor: colors.primary[600],
                      backgroundColor: colors.primary[50],
                    },
                  }}
                >
                  Amigos en Común
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<GiftIcon />}
                  onClick={() => onViewWishes(contact.id)}
                  sx={{
                    backgroundColor: colors.primary[500],
                    '&:hover': {
                      backgroundColor: colors.primary[600],
                    },
                  }}
                >
                  Ver Deseos
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContactProfileModal;