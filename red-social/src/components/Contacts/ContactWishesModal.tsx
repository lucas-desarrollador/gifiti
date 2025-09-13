import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  CardGiftcard as GiftIcon,
} from '@mui/icons-material';
import { colors } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { WishService } from '../../services/wishService';
import WishDetailModal from '../Wishes/WishDetailModal';

interface ContactWish {
  id: string;
  title: string;
  description: string;
  image: string;
  position: number;
  isReserved: boolean;
  reservedBy?: string;
  helpLink?: string;
}

interface ContactWishesModalProps {
  open: boolean;
  onClose: () => void;
  contactId: string;
  contactName: string;
}

const ContactWishesModal: React.FC<ContactWishesModalProps> = ({
  open,
  onClose,
  contactId,
  contactName,
}) => {
  const { state } = useAuth();
  const [wishes, setWishes] = useState<ContactWish[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedWish, setSelectedWish] = useState<ContactWish | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const [isMarkingSecured, setIsMarkingSecured] = useState(false);

  const contactNickname = contactName.split(' ')[0].toLowerCase();

  const loadContactWishes = async () => {
    if (!contactId || !state.token) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `http://localhost:3001/api/contact-profile/${contactId}/wishes`,
        {
          headers: {
            'Authorization': `Bearer ${state.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al cargar los deseos del contacto');
      }

      const data = await response.json();
      console.log('🎁 Deseos cargados:', data.data);
      
      // Log detallado de cada deseo y su imagen
      if (data.data && Array.isArray(data.data)) {
        data.data.forEach((wish: any, index: number) => {
          console.log(`🖼️ Deseo ${index + 1}:`, {
            id: wish.id,
            title: wish.title,
            image: wish.image,
            imageUrl: wish.image ? `http://localhost:3001/uploads/wishes/${wish.image}` : 'Sin imagen',
            hasImage: !!wish.image
          });
        });
      }
      
      setWishes(data.data || []);
    } catch (err) {
      console.error('Error al cargar deseos:', err);
      setError('Error al cargar los deseos del contacto');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && contactId) {
      loadContactWishes();
    }
  }, [open, contactId, state.token]);

  const handleWishClick = (wish: ContactWish) => {
    setSelectedWish(wish);
    setIsDetailModalOpen(true);
  };

  const handleReserveWish = async (wishId: string) => {
    console.log('🎯 Reservando deseo:', wishId);
    console.log('👤 Usuario actual:', state.user?.id);
    console.log('📋 Deseo seleccionado:', selectedWish?.id);
    
    // Cambiar el estado local inmediatamente (lo que ya funcionaba)
    setWishes(prevWishes => 
      prevWishes.map(wish => 
        wish.id === wishId 
          ? { ...wish, isReserved: true, reservedBy: state.user?.id }
          : wish
      )
    );
    
    // Actualizar el deseo seleccionado si es el mismo
    if (selectedWish && selectedWish.id === wishId) {
      console.log('🔄 Actualizando deseo seleccionado');
      setSelectedWish(prev => prev ? { 
        ...prev, 
        isReserved: true, 
        reservedBy: state.user?.id 
      } : null);
    }
    
    // Intentar guardar en el backend (sin bloquear la UI)
    try {
      await WishService.reserveWish(wishId);
      console.log('✅ Deseo reservado en el servidor');
    } catch (error) {
      console.error('❌ Error al guardar en servidor:', error);
      // Si falla, revertir el estado local
      setWishes(prevWishes => 
        prevWishes.map(wish => 
          wish.id === wishId 
            ? { ...wish, isReserved: false, reservedBy: undefined }
            : wish
        )
      );
      if (selectedWish && selectedWish.id === wishId) {
        setSelectedWish(prev => prev ? { 
          ...prev, 
          isReserved: false, 
          reservedBy: undefined 
        } : null);
      }
    }
  };

  const handleCancelReservation = async (wishId: string) => {
    // Cambiar el estado local inmediatamente (lo que ya funcionaba)
    setWishes(prevWishes => 
      prevWishes.map(wish => 
        wish.id === wishId 
          ? { ...wish, isReserved: false, reservedBy: undefined }
          : wish
      )
    );
    
    // Actualizar el deseo seleccionado si es el mismo
    if (selectedWish && selectedWish.id === wishId) {
      setSelectedWish(prev => prev ? { 
        ...prev, 
        isReserved: false, 
        reservedBy: undefined 
      } : null);
    }
    
    // Intentar guardar en el backend (sin bloquear la UI)
    try {
      await WishService.cancelReservation(wishId);
      console.log('✅ Reserva cancelada en el servidor');
    } catch (error) {
      console.error('❌ Error al guardar en servidor:', error);
      // Si falla, revertir el estado local
      setWishes(prevWishes => 
        prevWishes.map(wish => 
          wish.id === wishId 
            ? { ...wish, isReserved: true, reservedBy: state.user?.id }
            : wish
        )
      );
      if (selectedWish && selectedWish.id === wishId) {
        setSelectedWish(prev => prev ? { 
          ...prev, 
          isReserved: true, 
          reservedBy: state.user?.id 
        } : null);
      }
    }
  };

  const handleMarkAsSecured = async (wishId: string) => {
    setIsMarkingSecured(true);
    try {
      // TODO: Implementar llamada a la API para marcar como asegurado
      console.log('Marcando deseo como asegurado:', wishId);
      
      // TODO: Enviar notificación al contacto de que el regalo está listo
      console.log('Enviando notificación de regalo listo al contacto:', contactId);
      
    } catch (error) {
      console.error('Error al marcar como asegurado:', error);
    } finally {
      setIsMarkingSecured(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: colors.background.primary,
          borderRadius: 2,
          minHeight: '60vh',
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
          Deseos de {contactNickname}
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

        {!loading && !error && wishes.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" sx={{ color: colors.text.secondary }}>
              Este contacto no tiene deseos registrados
            </Typography>
          </Box>
        )}

        {!loading && !error && wishes.length > 0 && (
          <Grid container spacing={2}>
            {wishes.map((wish) => {
              // Construir URL correcta - el campo image ya puede contener la ruta completa
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
              
              console.log(`🎨 Renderizando deseo ${wish.id}:`, {
                title: wish.title,
                image: wish.image,
                imageUrl: imageUrl,
                hasImage: !!wish.image
              });
              
              return (
                <Grid item xs={12} sm={6} md={4} key={wish.id}>
                  <Card
                    onClick={() => handleWishClick(wish)}
                    sx={{
                      backgroundColor: colors.background.secondary,
                      border: `1px solid ${colors.border.primary}`,
                      borderRadius: 2,
                      overflow: 'hidden',
                      position: 'relative',
                      height: 240,
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    {imageUrl ? (
                      <CardMedia
                        component="img"
                        height="180"
                        image={imageUrl}
                        alt={wish.title}
                        sx={{
                          objectFit: 'cover',
                          width: '100%',
                        }}
                        onLoad={() => console.log('✅ Imagen cargada correctamente:', imageUrl)}
                        onError={(e) => {
                          console.log('❌ Error al cargar imagen:', imageUrl);
                          // Si falla la carga, mostrar placeholder
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : null}
                    
                    {/* Placeholder si no hay imagen o falla la carga */}
                    {!imageUrl && (
                      <Box
                        sx={{
                          height: 180,
                          backgroundColor: colors.background.tertiary,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 1,
                        }}
                      >
                        <GiftIcon sx={{ color: colors.text.tertiary, fontSize: 40 }} />
                        <Typography variant="body2" sx={{ color: colors.text.tertiary }}>
                          Sin imagen
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ p: 2, position: 'relative', textAlign: 'center' }}>
                      <Chip
                        label={`#${wish.position}`}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: -10,
                          left: 12,
                          backgroundColor: colors.primary[500],
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          zIndex: 1,
                        }}
                      />
                      
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: colors.text.primary, 
                          fontWeight: 600,
                          mt: 1,
                          fontSize: '1rem',
                        }}
                      >
                        {wish.title}
                      </Typography>
                      
                      {wish.isReserved && (
                        <Chip
                          label="Reservado"
                          size="small"
                          sx={{
                            backgroundColor: colors.success?.[100] || '#e8f5e8',
                            color: colors.success?.[700] || '#2e7d32',
                            fontSize: '0.75rem',
                            mt: 1,
                          }}
                        />
                      )}
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </DialogContent>

      {/* Modal de detalle del deseo */}
      <WishDetailModal
        open={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedWish(null);
        }}
        wish={selectedWish ? {
          ...selectedWish,
          contactName: contactName,
          contactId: contactId,
        } : null}
        onReserve={handleReserveWish}
        onCancelReservation={handleCancelReservation}
        onMarkAsSecured={handleMarkAsSecured}
        isReserving={isReserving}
        isMarkingSecured={isMarkingSecured}
      />
    </Dialog>
  );
};

export default ContactWishesModal;