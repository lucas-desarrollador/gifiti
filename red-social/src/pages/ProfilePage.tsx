import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  Alert,
  Grid,
  IconButton,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { UserService } from '../services/userService';
import { ProfileForm, User } from '../types';
import { colors } from '../theme';
import ReputationIcons from '../components/ReputationIcons';
import { getProfileImageUrl } from '../utils/imageUtils';

const schema = yup.object({
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
  address: yup.string().optional(),
  age: yup.number().positive('La edad debe ser un número positivo').optional(),
});

const ProfilePage: React.FC = () => {
  const { state, updateUser, refreshUser } = useAuth();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileForm>({
    resolver: yupResolver(schema),
  });

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (state.user) {
      reset({
        nickname: state.user.nickname,
        realName: state.user.realName,
        birthDate: state.user.birthDate,
        address: state.user.address || '',
        age: state.user.age || undefined,
      });
      // Cargar la imagen del usuario
      if (state.user.profileImage) {
        const imageUrl = state.user.profileImage.startsWith('http') 
          ? state.user.profileImage 
          : `http://localhost:3001${state.user.profileImage}`;
        console.log('🖼️ Cargando imagen de perfil:', {
          originalImage: state.user.profileImage,
          finalUrl: imageUrl
        });
        setPreviewImage(imageUrl);
      } else {
        console.log('🖼️ No hay imagen de perfil');
        setPreviewImage('');
      }
    }
  }, [state.user, reset]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileForm) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const formData: ProfileForm = {
        ...data,
        profileImage: profileImage || undefined,
      };

      const updatedUser = await UserService.updateProfile(formData);
      updateUser(updatedUser);
      
      // Refrescar el usuario desde el servidor para obtener la imagen actualizada
      await refreshUser();
      
      setSuccess('Perfil actualizado correctamente');
      setProfileImage(null);
      setPreviewImage(''); // Limpiar la vista previa
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  if (!state.user) {
    return (
      <Container>
        <Typography>No se pudo cargar la información del usuario.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 3 } }}>
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
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '1.75rem', sm: '2.125rem' },
            color: colors.text.primary,
            fontWeight: 600
          }}
        >
          Mi Perfil
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Foto de perfil */}
            <Grid item xs={12} md={4}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box sx={{ position: 'relative', mb: 2 }}>
                  <Avatar
                    src={previewImage || getProfileImageUrl(state.user.profileImage)}
                    sx={{ 
                      width: { xs: 120, sm: 150 }, 
                      height: { xs: 120, sm: 150 }, 
                      border: `3px solid ${colors.primary[200]}`,
                      boxShadow: '0 4px 12px rgba(20, 184, 166, 0.15)',
                      fontSize: { xs: '2rem', sm: '2.5rem' }
                    }}
                  >
                    {state.user.nickname.charAt(0).toUpperCase()}
                  </Avatar>
                  
                  {/* Iconos de reputación */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -5,
                      left: -5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      backgroundColor: colors.background.card,
                      padding: '4px 8px',
                      borderRadius: 2,
                      border: `1px solid ${colors.border.light}`,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <ReputationIcons
                      positiveVotes={0} // TODO: Obtener de la API
                      negativeVotes={0} // TODO: Obtener de la API
                      size="small"
                    />
                  </Box>
                  
                  {/* Icono de corazón negro (solo si hay votos negativos) */}
                  {true && ( // TODO: Cambiar a negativeVotes > 0 cuando conectemos con API
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: -5,
                        right: -5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        backgroundColor: colors.background.card,
                        padding: '4px 8px',
                        borderRadius: 2,
                        border: `1px solid ${colors.border.light}`,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                    <ReputationIcons
                      positiveVotes={0}
                      negativeVotes={1} // TODO: Obtener de la API
                      size="small"
                      showOnlyNegative={true}
                    />
                    </Box>
                  )}
                </Box>
                
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="profile-image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="profile-image-upload">
                  <IconButton
                    color="primary"
                    aria-label="subir foto"
                    component="span"
                  >
                    <PhotoCamera />
                  </IconButton>
                </label>
                <Typography variant="body2" color="text.secondary">
                  Cambiar foto
                </Typography>
              </Box>
            </Grid>

            {/* Formulario */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nickname"
                    {...register('nickname')}
                    error={!!errors.nickname}
                    helperText={errors.nickname?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre Real"
                    {...register('realName')}
                    error={!!errors.realName}
                    helperText={errors.realName?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Fecha de Nacimiento"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register('birthDate')}
                    error={!!errors.birthDate}
                    helperText={errors.birthDate?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Edad"
                    type="number"
                    {...register('age')}
                    error={!!errors.age}
                    helperText={errors.age?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Dirección"
                    multiline
                    rows={3}
                    {...register('address')}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
