import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip
} from '@mui/material';
import { Person, Visibility, ShoppingCart } from '@mui/icons-material';
import { colors } from '../../theme';
import { Wish } from '../../types';
import { ContactService } from '../../services/contactService';

interface WishCardProps {
  wish: Wish;
}

const WishCard: React.FC<WishCardProps> = ({ wish }) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isWishModalOpen, setIsWishModalOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  const handleUserClick = () => {
    if (wish.user?.isPublic) {
      setIsProfileModalOpen(true);
    }
  };

  const handleWishClick = () => {
    setIsWishModalOpen(true);
  };

  const handleSendInvitation = async () => {
    if (!wish.user?.id) return;
    
    try {
      setIsInviting(true);
      await ContactService.sendContactRequest(wish.user.id);
      
      // Cerrar ambos modales
      setIsProfileModalOpen(false);
      setIsWishModalOpen(false);
      
      // Emitir evento personalizado para actualizar la pestaña de contactos
      window.dispatchEvent(new CustomEvent('contactInvitationSent', {
        detail: { userId: wish.user.id, nickname: wish.user.nickname }
      }));
      
      // Mostrar notificación de éxito (opcional)
      console.log(`✅ Invitación enviada a ${wish.user.nickname}`);
    } catch (error) {
      console.error('Error al enviar invitación:', error);
      // Aquí podrías mostrar una notificación de error
    } finally {
      setIsInviting(false);
    }
  };

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return '/placeholder-wish.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3001${imagePath}`;
  };

  const getUserInitial = (nickname?: string) => {
    return nickname ? nickname.charAt(0).toUpperCase() : '?';
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          },
        }}
        onClick={handleWishClick}
      >
        {/* Imagen del deseo */}
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="200"
            image={getImageUrl(wish.image)}
            alt={wish.title}
            sx={{
              objectFit: 'cover',
            }}
          />
          
          {/* Círculo con inicial del usuario (solo si es público) */}
          {wish.user?.isPublic && (
            <Tooltip title={`Ver perfil de ${wish.user.nickname}`}>
              <Avatar
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 32,
                  height: 32,
                  backgroundColor: colors.primary[600],
                  color: 'white',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: colors.primary[700],
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleUserClick();
                }}
              >
                {getUserInitial(wish.user.nickname)}
              </Avatar>
            </Tooltip>
          )}

          {/* Chip de estado si está reservado */}
          {wish.isReserved && (
            <Chip
              label="Reservado"
              size="small"
              sx={{
                position: 'absolute',
                bottom: 8,
                left: 8,
                backgroundColor: colors.status.warning,
                color: 'white',
                fontSize: '0.75rem',
              }}
            />
          )}
        </Box>

        {/* Contenido del deseo */}
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{
              fontSize: '1rem',
              fontWeight: 600,
              color: colors.text.primary,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.3,
            }}
          >
            {wish.title}
          </Typography>
          
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4,
            }}
          >
            {wish.description}
          </Typography>

          {/* Información del usuario */}
          {wish.user && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mt: 2,
              pt: 2,
              borderTop: '1px solid #f0f0f0'
            }}>
              <Person sx={{ 
                fontSize: '1rem', 
                color: colors.text.secondary,
                mr: 1 
              }} />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: '0.75rem' }}
              >
                {wish.user.isPublic ? wish.user.nickname : 'Usuario privado'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Modal de perfil del usuario */}
      <Dialog
        open={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Perfil de {wish.user?.nickname}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Avatar
              src={wish.user?.profileImage ? getImageUrl(wish.user.profileImage) : undefined}
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                backgroundColor: colors.primary[600],
                fontSize: '2rem',
              }}
            >
              {getUserInitial(wish.user?.nickname)}
            </Avatar>
            <Typography variant="h6" gutterBottom>
              {wish.user?.realName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{wish.user?.nickname}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsProfileModalOpen(false)}>
            Cerrar
          </Button>
          <Button
            variant="contained"
            onClick={handleSendInvitation}
            disabled={isInviting}
            sx={{
              backgroundColor: colors.primary[600],
              '&:hover': {
                backgroundColor: colors.primary[700],
              }
            }}
          >
            {isInviting ? 'Enviando...' : 'Enviar invitación'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de detalles del deseo */}
      <Dialog
        open={isWishModalOpen}
        onClose={() => setIsWishModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {wish.title}
        </DialogTitle>
        <DialogContent>
          {wish.image && (
            <Box sx={{ mb: 3 }}>
              <img
                src={getImageUrl(wish.image)}
                alt={wish.title}
                style={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            </Box>
          )}
          
          <Typography variant="body1" paragraph>
            {wish.description}
          </Typography>

          {wish.purchaseLink && (
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ShoppingCart />}
                href={wish.purchaseLink}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  borderColor: colors.primary[600],
                  color: colors.primary[600],
                  '&:hover': {
                    borderColor: colors.primary[700],
                    backgroundColor: colors.primary[50],
                  }
                }}
              >
                Ver en tienda
              </Button>
            </Box>
          )}

          {wish.user && (
            <Box sx={{ 
              mt: 3, 
              p: 2, 
              backgroundColor: '#f5f5f5', 
              borderRadius: 1 
            }}>
              <Typography variant="subtitle2" gutterBottom>
                Deseo de:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src={wish.user.profileImage ? getImageUrl(wish.user.profileImage) : undefined}
                  sx={{
                    width: 40,
                    height: 40,
                    mr: 2,
                    backgroundColor: colors.primary[600],
                  }}
                >
                  {getUserInitial(wish.user.nickname)}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {wish.user.realName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    @{wish.user.nickname}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsWishModalOpen(false)}>
            Cerrar
          </Button>
          {wish.user?.isPublic && (
            <>
              <Button
                variant="outlined"
                startIcon={<Person />}
                onClick={() => {
                  setIsWishModalOpen(false);
                  setIsProfileModalOpen(true);
                }}
                sx={{
                  borderColor: colors.primary[600],
                  color: colors.primary[600],
                  '&:hover': {
                    borderColor: colors.primary[700],
                    backgroundColor: colors.primary[50],
                  }
                }}
              >
                Ver perfil
              </Button>
              <Button
                variant="contained"
                startIcon={<Person />}
                onClick={handleSendInvitation}
                disabled={isInviting}
                sx={{
                  backgroundColor: colors.primary[600],
                  '&:hover': {
                    backgroundColor: colors.primary[700],
                  }
                }}
              >
                {isInviting ? 'Enviando...' : 'Invitar a conectar'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WishCard;
