import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Fab
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { colors } from '../theme';
import { WishService } from '../services/wishService';
import { Wish } from '../types';
import WishCard from '../components/Explore/WishCard';

const ExplorePage: React.FC = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadWishes = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      console.log('🔍 Cargando deseos, página:', pageNum);
      const response = await WishService.exploreWishes(pageNum, 20);
      
      console.log('✅ Deseos cargados:', response);
      
      if (append) {
        setWishes(prev => [...prev, ...response.data]);
      } else {
        setWishes(response.data);
      }
      
      setHasMore(response.hasMore || false);
      setPage(pageNum);
    } catch (err) {
      console.error('❌ Error al cargar deseos:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar deseos');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadWishes(page + 1, true);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    setHasMore(true);
    loadWishes(1, false);
  };

  useEffect(() => {
    loadWishes(1, false);
  }, [loadWishes]);

  if (loading && wishes.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '50vh'
        }}>
          <CircularProgress size={60} sx={{ color: colors.primary[600] }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: colors.text.primary }}>
          Explorar Deseos
        </Typography>
        <Typography variant="body1" sx={{ color: colors.text.secondary }}>
          Descubre deseos interesantes de tu red y usuarios nuevos
        </Typography>
      </Box>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Grid de deseos */}
      {wishes.length > 0 ? (
        <Box>
          <Grid container spacing={2}>
            {wishes.map((wish, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={`${wish.id}-${wish.userId}-${index}`}>
                <WishCard wish={wish} />
              </Grid>
            ))}
          </Grid>

          {/* Botón de cargar más */}
          {hasMore && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 4 
            }}>
              {loadingMore ? (
                <CircularProgress sx={{ color: colors.primary[600] }} />
              ) : (
                <Fab
                  variant="extended"
                  color="primary"
                  onClick={handleLoadMore}
                  sx={{
                    backgroundColor: colors.primary[600],
                    '&:hover': {
                      backgroundColor: colors.primary[700],
                    }
                  }}
                >
                  Cargar más deseos
                </Fab>
              )}
            </Box>
          )}
        </Box>
      ) : (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          backgroundColor: '#f5f5f5',
          borderRadius: 2
        }}>
          <Typography variant="h6" gutterBottom>
            No hay deseos para explorar
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Intenta refrescar la página o vuelve más tarde
          </Typography>
        </Box>
      )}

      {/* Botón de refresh flotante */}
      <Fab
        color="primary"
        aria-label="refresh"
        onClick={handleRefresh}
        disabled={loading}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: colors.primary[600],
          '&:hover': {
            backgroundColor: colors.primary[700],
          }
        }}
      >
        <Refresh />
      </Fab>
    </Container>
  );
};

export default ExplorePage;
