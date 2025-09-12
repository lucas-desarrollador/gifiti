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

interface ContactWish {
  id: string;
  title: string;
  description: string;
  image: string;
  position: number;
  isReserved: boolean;
  reservedBy?: string;
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
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
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
      </DialogTitle>

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
              const imageUrl = wish.image ? `http://localhost:3001/uploads/wishes/${wish.image}` : null;
              
              return (
                <Grid item xs={12} sm={6} md={4} key={wish.id}>
                  <Card
                    sx={{
                      backgroundColor: colors.background.secondary,
                      border: `1px solid ${colors.border.primary}`,
                      borderRadius: 2,
                      overflow: 'hidden',
                      position: 'relative',
                      height: 200,
                    }}
                  >
                    {imageUrl ? (
                      <CardMedia
                        component="img"
                        height="140"
                        image={imageUrl}
                        alt={wish.title}
                        sx={{
                          objectFit: 'cover',
                        }}
                        onLoad={() => console.log('✅ Imagen cargada correctamente:', imageUrl)}
                        onError={() => console.log('❌ Error al cargar imagen:', imageUrl)}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 140,
                          backgroundColor: colors.background.tertiary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="body2" sx={{ color: colors.text.tertiary }}>
                          Sin imagen
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ p: 1.5, position: 'relative' }}>
                      <Chip
                        label={`#${wish.position}`}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: -10,
                          left: 8,
                          backgroundColor: colors.primary[500],
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      />
                      
                      {wish.isReserved && (
                        <Chip
                          label="Reservado"
                          size="small"
                          sx={{
                            backgroundColor: colors.success[100],
                            color: colors.success[700],
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
    </Dialog>
  );
};

export default ContactWishesModal;