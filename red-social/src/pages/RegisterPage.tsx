import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link as RouterLink, useSearchParams } from 'react-router-dom';
import { RegisterForm } from '../types';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { GoogleAuthResponse, GoogleUser } from '../services/googleAuthService';

const schema = yup.object({
  email: yup
    .string()
    .email('Email inválido')
    .required('El email es requerido'),
  password: yup
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .required('La contraseña es requerida'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
  nickname: yup
    .string()
    .min(3, 'El nickname debe tener al menos 3 caracteres')
    .max(30, 'El nickname no puede tener más de 30 caracteres')
    .required('El nickname es requerido'),
  realName: yup
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .required('El nombre real es requerido'),
  birthDate: yup
    .string()
    .required('La fecha de nacimiento es requerida'),
});

const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleUserData, setGoogleUserData] = useState<GoogleUser | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterForm>({
    resolver: yupResolver(schema),
  });

  // Cargar datos de Google si viene del login
  React.useEffect(() => {
    const isGoogleAuth = searchParams.get('google') === 'true';
    if (isGoogleAuth) {
      const savedGoogleData = localStorage.getItem('googleUserData');
      if (savedGoogleData) {
        const userData: GoogleUser = JSON.parse(savedGoogleData);
        setGoogleUserData(userData);
        
        // Pre-llenar formulario con datos de Google
        setValue('email', userData.email);
        setValue('realName', userData.name);
        setValue('nickname', userData.given_name || userData.name.split(' ')[0]);
        
        // Limpiar datos guardados
        localStorage.removeItem('googleUserData');
      }
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      setError('');
      await registerUser(data);
      navigate('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async (response: any) => {
    try {
      setIsLoading(true);
      setError('');
      
      if (!response.success) {
        setError(response.error || 'Error al autenticar con Google');
        return;
      }

      if (!response.user) {
        setError('No se pudo obtener información del usuario');
        return;
      }

      // Crear usuario con datos de Google
      const userData = {
        email: response.user.email,
        password: 'google_auth', // Password especial para usuarios de Google
        nickname: response.user.given_name || response.user.name.split(' ')[0],
        realName: response.user.name,
        birthDate: '1990-01-01' // Fecha por defecto, el usuario puede cambiarla después
      };

      await registerUser(userData);
      navigate('/profile');
      
    } catch (err) {
      setError('Error al registrarse con Google. Por favor, usa el formulario normal.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Registrarse
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              autoComplete="email"
              autoFocus
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="new-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirmar Contraseña"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Nickname"
              id="nickname"
              {...register('nickname')}
              error={!!errors.nickname}
              helperText={errors.nickname?.message}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Nombre Real"
              id="realName"
              {...register('realName')}
              error={!!errors.realName}
              helperText={errors.realName?.message}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Fecha de Nacimiento"
              type="date"
              id="birthDate"
              InputLabelProps={{
                shrink: true,
              }}
              {...register('birthDate')}
              error={!!errors.birthDate}
              helperText={errors.birthDate?.message}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </Button>

            {/* Separador */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              my: 2,
              '&::before, &::after': {
                content: '""',
                flex: 1,
                height: '1px',
                backgroundColor: 'rgba(0, 0, 0, 0.12)',
              },
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  px: 2, 
                  color: 'text.secondary',
                  backgroundColor: 'white',
                }}
              >
                o
              </Typography>
            </Box>

            {/* Botón de Google */}
            <GoogleAuthButton 
              onGoogleAuth={handleGoogleAuth}
              isLoading={isLoading}
              variant="register"
            />
            
            <Box textAlign="center" sx={{ mt: 2 }}>
              <Link component={RouterLink} to="/login" variant="body2">
                ¿Ya tienes cuenta? Inicia sesión aquí
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
