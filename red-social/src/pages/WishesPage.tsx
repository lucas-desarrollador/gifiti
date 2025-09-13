import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { WishService } from '../services/wishService';
import type { Wish, WishForm } from '../types';
import WishFormDialog from '../components/Wishes/WishFormDialog';
import { colors } from '../theme';

const WishesPage: React.FC = () => {
  const { state } = useAuth();
  const { state: appState, setWishes, addWish, updateWish, removeWish } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWish, setEditingWish] = useState<Wish | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Cargar deseos al montar el componente
  useEffect(() => {
    loadWishes();
  }, []);

  const loadWishes = async () => {
    try {
      setIsLoading(true);
      const wishes = await WishService.getUserWishes();
      setWishes(wishes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los deseos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWish = () => {
    setEditingWish(null);
    setIsFormOpen(true);
  };

  const handleEditWish = (wish: Wish) => {
    setEditingWish(wish);
    setIsFormOpen(true);
  };

  const handleDeleteWish = async (wishId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este deseo?')) {
      try {
        await WishService.deleteWish(wishId);
        removeWish(wishId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al eliminar el deseo');
      }
    }
  };

  const handleFormSubmit = async (wishData: WishForm) => {
    try {
      setError('');
      if (editingWish) {
        // Actualizar deseo existente
        const updatedWish = await WishService.updateWish(editingWish.id, wishData);
        updateWish(updatedWish);
      } else {
        // Crear nuevo deseo
        const newWish = await WishService.addWish(wishData);
        addWish(newWish);
      }
      setIsFormOpen(false);
      setEditingWish(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el deseo');
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingWish(null);
  };

  const canAddMoreWishes = appState.wishes.length < 10;

  if (!state.user) {
    return (
      <Container>
        <Typography>No se pudo cargar la información del usuario.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
      <Paper 
        elevation={3} 
        sx={{ 
          padding: { xs: 2, sm: 4 }, 
          mt: { xs: 2, sm: 3 },
          borderRadius: 3,
          background: colors.background.card,
          border: `1px solid ${colors.border.light}`
        }}
      >
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mb={3}
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={{ xs: 2, sm: 0 }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Typography 
              variant="h4"
              sx={{ 
                fontSize: { xs: '1.75rem', sm: '2.125rem' },
                color: colors.text.primary,
                fontWeight: 600
              }}
            >
              Top Deseos
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '0.875rem' },
                color: colors.text.secondary
              }}
            >
              {appState.wishes.length}/10 deseos
            </Typography>
          </Box>
          {canAddMoreWishes && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddWish}
            >
              Agregar Deseo
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {appState.wishes.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aún no tienes deseos en tu lista
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Agrega hasta 10 deseos que te gustaría recibir como regalo
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddWish}
              disabled={!canAddMoreWishes}
            >
              Agregar Primer Deseo
            </Button>
          </Box>
        ) : (
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {appState.wishes
              .sort((a, b) => a.position - b.position)
              .map((wish) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={wish.id}>
                  <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 3,
                    border: `1px solid ${colors.border.light}`,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                      transform: 'translateY(-2px)'
                    }
                  }}>
                    {wish.image ? (
                      <CardMedia
                        component="img"
                        height="200"
                        image={(() => {
                          if (!wish.image) return '';
                          const imageUrl = wish.image.startsWith('http') ? wish.image : `http://localhost:3001${wish.image}`;
                          console.log('🖼️ Construyendo URL de imagen:', {
                            originalImage: wish.image,
                            finalUrl: imageUrl
                          });
                          return imageUrl;
                        })()}
                        alt={wish.title}
                        sx={{
                          objectFit: 'cover',
                          width: '100%',
                          height: '200px'
                        }}
                        onError={(e) => {
                          console.error('❌ Error al cargar imagen:', e);
                          console.error('❌ URL que falló:', wish.image.startsWith('http') ? wish.image : `http://localhost:3001${wish.image}`);
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: '200px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f5f5f5',
                          color: '#999'
                        }}
                      >
                        <Typography variant="body2">
                          Sin imagen
                        </Typography>
                      </Box>
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="h2">
                        #{wish.position} - {wish.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {wish.description}
                      </Typography>
                      {wish.purchaseLink && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinkIcon fontSize="small" />
                          <Typography variant="caption" color="primary">
                            Disponible online
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                      <Box>
                        {wish.purchaseLink && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<LinkIcon />}
                            onClick={() => window.open(wish.purchaseLink, '_blank')}
                            sx={{
                              color: colors.primary[600],
                              borderColor: colors.primary[300],
                              '&:hover': {
                                borderColor: colors.primary[500],
                                backgroundColor: colors.primary[50]
                              }
                            }}
                          >
                            Sitio
                          </Button>
                        )}
                      </Box>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => handleEditWish(wish)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteWish(wish.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
          </Grid>
        )}

        {/* Botón flotante eliminado - ahora está en el header */}
      </Paper>

      {/* Dialog para formulario de deseo */}
      <WishFormDialog
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        wish={editingWish}
        isEditing={!!editingWish}
      />
    </Container>
  );
};

export default WishesPage;
