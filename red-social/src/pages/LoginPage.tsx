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
  Grid,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { LoginForm } from '../types';
import { APP_NAME } from '../constants';

const schema = yup.object({
  email: yup
    .string()
    .email('Email inválido')
    .required('El email es requerido'),
  password: yup
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .required('La contraseña es requerida'),
});

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      setError('');
      await login(data);
      navigate('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Efectos de fondo profesionales */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(20, 184, 166, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(20, 184, 166, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(20, 184, 166, 0.06) 0%, transparent 50%)
          `,
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          {/* Robot mascota - Lado izquierdo */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: { xs: 'auto', md: '80vh' },
                position: 'relative',
              }}
            >
              {/* Robot con efectos profesionales */}
              <Fade in timeout={1000}>
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    animation: 'robotFloat 3s ease-in-out infinite',
                    '@keyframes robotFloat': {
                      '0%, 100%': {
                        transform: 'translateY(0px)',
                      },
                      '50%': {
                        transform: 'translateY(-10px)',
                      },
                    },
                  }}
                >
                  {/* Efecto de brillo detrás del robot */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: { xs: 200, sm: 250, md: 300 },
                      height: { xs: 200, sm: 250, md: 300 },
                      background: `
                        radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, transparent 70%)
                      `,
                      borderRadius: '50%',
                      filter: 'blur(20px)',
                      zIndex: -1,
                    }}
                  />
                  
                  {/* Robot principal */}
                  <Zoom in timeout={1500}>
                    <Box
                      component="img"
                      src="/src/assets/lugo_gift_01.png"
                      alt="Robot mascota de GiFiTi"
                      sx={{
                        width: { xs: 200, sm: 250, md: 300 },
                        height: 'auto',
                        filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1))',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.15))',
                        },
                      }}
                    />
                  </Zoom>
                  
                  {/* Texto de bienvenida */}
                  <Fade in timeout={2000}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        textAlign: 'center',
                        mt: 3,
                        mb: 1,
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      ¡Bienvenido a {APP_NAME}!
                    </Typography>
                  </Fade>
                  
                  <Fade in timeout={2500}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: theme.palette.text.secondary,
                        textAlign: 'center',
                        maxWidth: 400,
                        lineHeight: 1.6,
                      }}
                    >
                      Tu robot amigo te ayudará a encontrar los regalos perfectos
                    </Typography>
                  </Fade>
                </Box>
              </Fade>
            </Box>
          </Grid>

          {/* Formulario de login - Lado derecho */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: { xs: 'auto', md: '80vh' },
              }}
            >
              <Fade in timeout={1000}>
                <Paper
                  elevation={8}
                  sx={{
                    padding: { xs: 3, sm: 4, md: 5 },
                    width: '100%',
                    maxWidth: 450,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: `
                      0 8px 32px rgba(0, 0, 0, 0.1),
                      0 0 0 1px rgba(255, 255, 255, 0.2)
                    `,
                  }}
                >
                  <Typography
                    component="h1"
                    variant="h4"
                    align="center"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.primary.main,
                      mb: 3,
                    }}
                  >
                    Iniciar Sesión
                  </Typography>
                  
                  {error && (
                    <Fade in>
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                      </Alert>
                    </Fade>
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                    
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Contraseña"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      {...register('password')}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                    
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      sx={{
                        mt: 3,
                        mb: 2,
                        py: 1.5,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        boxShadow: '0 4px 15px rgba(20, 184, 166, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(20, 184, 166, 0.4)',
                        },
                        '&:disabled': {
                          background: theme.palette.grey[300],
                          color: theme.palette.grey[500],
                        },
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </Button>
                    
                    <Box textAlign="center" sx={{ mt: 2 }}>
                      <Link
                        component={RouterLink}
                        to="/register"
                        variant="body2"
                        sx={{
                          color: theme.palette.primary.main,
                          textDecoration: 'none',
                          fontWeight: 500,
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        ¿No tienes cuenta? Regístrate aquí
                      </Link>
                    </Box>
                  </Box>
                </Paper>
              </Fade>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage;
