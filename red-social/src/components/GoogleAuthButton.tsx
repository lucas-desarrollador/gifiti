import React, { useEffect, useRef } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { Google } from '@mui/icons-material';

interface GoogleAuthButtonProps {
  onGoogleAuth: (response: any) => void;
  isLoading?: boolean;
  variant?: 'login' | 'register';
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ 
  onGoogleAuth, 
  isLoading = false,
  variant = 'login'
}) => {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const text = variant === 'login' ? 'Iniciar sesión con Google' : 'Registrarse con Google';

  useEffect(() => {
    // Cargar Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: '202608487449-q8gp5ju0gl43tbhbslv3lg5i618jbd54.apps.googleusercontent.com',
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: variant === 'login' ? 'signin_with' : 'signup_with',
          shape: 'rectangular'
        });
      }
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [variant]);

  const handleCredentialResponse = (response: any) => {
    try {
      // Decodificar el JWT token
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const userData = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        given_name: payload.given_name,
        family_name: payload.family_name
      };

      onGoogleAuth({
        success: true,
        user: userData,
        isNewUser: false // Lo determinaremos después
      });
    } catch (error) {
      onGoogleAuth({
        success: false,
        error: 'Error al procesar la respuesta de Google'
      });
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <div ref={googleButtonRef} style={{ width: '100%' }} />
    </Box>
  );
};

export default GoogleAuthButton;
