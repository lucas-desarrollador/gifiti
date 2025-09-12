import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import { Settings } from '@mui/icons-material';
import { colors } from '../theme';

const ExplorePage: React.FC = () => {
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header con botón de preferencias */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ color: colors.text.primary }}>
            Explorar
          </Typography>
          <Typography variant="body1" sx={{ color: colors.text.secondary }}>
            Descubre nuevos usuarios y deseos interesantes
          </Typography>
        </Box>
        
        <IconButton
          onClick={() => setPreferencesOpen(true)}
          sx={{
            backgroundColor: colors.primary[50],
            color: colors.primary[600],
            '&:hover': {
              backgroundColor: colors.primary[100],
            }
          }}
        >
          <Settings />
        </IconButton>
      </Box>
        
        <Box sx={{ 
          backgroundColor: '#f5f5f5', 
          p: 3, 
          borderRadius: 2,
          textAlign: 'center'
        }}>
          <Typography variant="h6" gutterBottom>
            🎁 Página de Explorar
          </Typography>
          <Typography variant="body2">
            Esta página está funcionando correctamente. 
            Aquí se mostrarán los deseos de otros usuarios.
          </Typography>
        </Box>

      {/* Diálogo de preferencias simple */}
      {preferencesOpen && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <Box sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            p: 3,
            maxWidth: 400,
            width: '90%'
          }}>
            <Typography variant="h6" gutterBottom>
              Preferencias de Exploración
            </Typography>
            <Typography variant="body2" paragraph>
              ¿Qué te gustaría explorar?
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                🎁 Deseos - Ver deseos de otros usuarios
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                👥 Usuarios - Conocer nuevos usuarios
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Box sx={{ 
                flex: 1, 
                p: 2, 
                border: '2px solid #e0e0e0', 
                borderRadius: 1,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#f5f5f5' }
              }}
              onClick={() => setPreferencesOpen(false)}
              >
                <Typography variant="body2">🎁 Deseos</Typography>
              </Box>
              <Box sx={{ 
                flex: 1, 
                p: 2, 
                border: '2px solid #e0e0e0', 
                borderRadius: 1,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#f5f5f5' }
              }}
              onClick={() => setPreferencesOpen(false)}
              >
                <Typography variant="body2">👥 Usuarios</Typography>
              </Box>
            </Box>
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  cursor: 'pointer', 
                  color: colors.text.secondary,
                  '&:hover': { color: colors.text.primary }
                }}
                onClick={() => setPreferencesOpen(false)}
              >
                Cancelar
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default ExplorePage;
