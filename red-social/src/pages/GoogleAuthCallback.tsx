import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { googleAuthService } from '../services/googleAuthService';

const GoogleAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const response = await googleAuthService.processCallback();
        
        if (response.success && response.user) {
          // Si es un usuario nuevo, ir a registro
          if (response.isNewUser) {
            localStorage.setItem('googleUserData', JSON.stringify(response.user));
            navigate('/register?google=true');
          } else {
            // Si es usuario existente, hacer login
            const loginData = {
              email: response.user.email,
              password: 'google_auth'
            };
            
            // Aquí necesitarías llamar al servicio de login
            // Por ahora redirigimos al perfil
            navigate('/profile');
          }
        } else {
          setError(response.error || 'Error en la autenticación');
        }
      } catch (err) {
        console.error('Error en callback:', err);
        setError('Error al procesar la autenticación con Google');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        gap: 2,
        p: 3
      }}
    >
      {error ? (
        <>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Serás redirigido al login en unos segundos...
          </Typography>
        </>
      ) : (
        <>
          <CircularProgress size={40} />
          <Typography variant="h6" color="text.secondary">
            Procesando autenticación...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Por favor, espera mientras completamos tu inicio de sesión.
          </Typography>
        </>
      )}
    </Box>
  );
};

export default GoogleAuthCallback;
