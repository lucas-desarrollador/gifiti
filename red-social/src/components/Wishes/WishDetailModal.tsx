import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  CardMedia,
  Chip,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import {
  Close as CloseIcon,
  CardGiftcard as GiftIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

interface WishDetail {
  id: string;
  title: string;
  description: string;
  image: string;
  position: number;
  isReserved: boolean;
  reservedBy?: string;
  helpLink?: string;
  contactName: string;
  contactId: string;
}

interface WishDetailModalProps {
  open: boolean;
  onClose: () => void;
  wish: WishDetail | null;
  onReserve: (wishId: string) => Promise<void>;
  onCancelReservation: (wishId: string) => Promise<void>;
  onMarkAsSecured: (wishId: string) => Promise<void>;
  isReserving: boolean;
  isMarkingSecured: boolean;
}

const WishDetailModal: React.FC<WishDetailModalProps> = ({
  open,
  onClose,
  wish,
  onReserve,
  onCancelReservation,
  onMarkAsSecured,
  isReserving,
  isMarkingSecured,
}) => {
  const { state } = useAuth();

  if (!wish) return null;

  // Construir URL de imagen
  let imageUrl = null;
  if (wish.image) {
    if (wish.image.startsWith('http')) {
      imageUrl = wish.image;
    } else if (wish.image.startsWith('/uploads/')) {
      imageUrl = `http://localhost:3001${wish.image}`;
    } else {
      imageUrl = `http://localhost:3001/uploads/wishes/${wish.image}`;
    }
  }

  const isReservedByCurrentUser = wish.reservedBy === state.user?.id;
  const isCurrentUserWish = wish.contactId === state.user?.id;
  
  console.log('🔍 WishDetailModal - Estado del deseo:', {
    id: wish.id,
    isReserved: wish.isReserved,
    reservedBy: wish.reservedBy,
    currentUserId: state.user?.id,
    isReservedByCurrentUser,
    isCurrentUserWish
  });

  const handleReserveClick = async () => {
    try {
      if (wish.isReserved && isReservedByCurrentUser) {
        await onCancelReservation(wish.id);
      } else if (!wish.isReserved) {
        await onReserve(wish.id);
      }
    } catch (error) {
      console.error('Error en handleReserveClick:', error);
    }
  };

  const handleSecuredClick = async () => {
    await onMarkAsSecured(wish.id);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#fff',
          borderRadius: 2,
          minHeight: '70vh',
        },
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        p: 2, 
        pb: 1,
        borderBottom: '1px solid #e0e0e0'
      }}>
        <GiftIcon sx={{ color: '#14b8a6' }} />
        <Typography variant="h6" sx={{ color: '#333', fontWeight: 600 }}>
          Detalle del Deseo
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton
          onClick={onClose}
          sx={{
            color: '#666',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 2 }}>
        {/* Imagen del deseo */}
        <Box sx={{ mb: 3, position: 'relative' }}>
          {imageUrl ? (
            <CardMedia
              component="img"
              height="300"
              image={imageUrl}
              alt={wish.title}
              sx={{
                objectFit: 'cover',
                width: '100%',
                borderRadius: 2,
              }}
            />
          ) : (
            <Box
              sx={{
                height: 300,
                backgroundColor: '#f9f9f9',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                borderRadius: 2,
              }}
            >
              <GiftIcon sx={{ color: '#999', fontSize: 60 }} />
              <Typography variant="body1" sx={{ color: '#999' }}>
                Sin imagen
              </Typography>
            </Box>
          )}
          
          {/* Chip de posición */}
          <Chip
            label={`#${wish.position}`}
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              backgroundColor: '#14b8a6',
              color: 'white',
              fontWeight: 600,
            }}
          />
          
          {/* Chip de reservado */}
          {wish.isReserved && (
            <Chip
              label={isReservedByCurrentUser ? "Reservado por ti" : "Reservado"}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                backgroundColor: '#4caf50',
                color: 'white',
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        {/* Información del deseo */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#333', 
              fontWeight: 600,
              mb: 2,
            }}
          >
            {wish.title}
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#666',
              mb: 2,
              lineHeight: 1.6,
            }}
          >
            {wish.description}
          </Typography>

          {/* Link de ayuda */}
          {wish.helpLink && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                Link de ayuda para encontrar este producto:
              </Typography>
              <Link
                href={wish.helpLink}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: '#0d9488',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                <LinkIcon fontSize="small" />
                {wish.helpLink}
              </Link>
            </Box>
          )}
        </Box>

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Botón de reservar/cancelar */}
          {!isCurrentUserWish && (
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleReserveClick}
              disabled={isReserving || (wish.isReserved && !isReservedByCurrentUser)}
              sx={{
                backgroundColor: wish.isReserved && isReservedByCurrentUser 
                  ? '#f44336' 
                  : '#14b8a6',
                color: 'white',
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: wish.isReserved && isReservedByCurrentUser 
                    ? '#d32f2f' 
                    : '#0d9488',
                },
              }}
            >
              {isReserving ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                wish.isReserved && isReservedByCurrentUser ? 'CANCELAR RESERVA' : 'RESERVAR'
              )}
            </Button>
          )}

          {/* Botón de asegurar (solo para quien reservó) */}
          {isReservedByCurrentUser && (
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={handleSecuredClick}
              disabled={isMarkingSecured}
              sx={{
                borderColor: '#4caf50',
                color: '#4caf50',
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#388e3c',
                  backgroundColor: '#e8f5e8',
                },
              }}
            >
              {isMarkingSecured ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'ASEGURADO'
              )}
            </Button>
          )}

          {/* Mensaje informativo */}
          {isCurrentUserWish && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Este es tu propio deseo. No puedes reservarlo.
            </Alert>
          )}
          
          {wish.isReserved && !isReservedByCurrentUser && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Este deseo ya ha sido reservado por otro usuario.
            </Alert>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default WishDetailModal;
