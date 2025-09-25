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
import lugoPerfilImage from '../assets/lugo_perfil.png';

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
  city: yup.string().optional(),
  province: yup.string().optional(),
  country: yup.string().optional(),
  postalAddress: yup.string().optional(),
  addressDetails: yup.string().optional(),
  age: yup.number().positive('La edad debe ser un número positivo').optional(),
  gender: yup.string().optional(),
  subProfilesCount: yup
    .number()
    .min(0, 'El número de sub-perfiles debe ser 0 o mayor')
    .max(10, 'El número máximo de sub-perfiles es 10')
    .optional(),
  selectedSubProfile: yup.string().optional(),
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
      console.log('👤 Usuario cargado:', {
        nickname: state.user.nickname,
        profileImage: state.user.profileImage,
        hasProfileImage: !!state.user.profileImage
      });
      
      reset({
        nickname: state.user.nickname,
        realName: state.user.realName,
        birthDate: state.user.birthDate,
        city: state.user.city || '',
        province: state.user.province || '',
        country: state.user.country || '',
        postalAddress: state.user.postalAddress || '',
        age: state.user.age || undefined,
      });
      // Cargar la imagen del usuario
      if (state.user.profileImage && state.user.profileImage.trim() !== '') {
        let imageUrl;
        if (state.user.profileImage.startsWith('http')) {
          imageUrl = state.user.profileImage;
        } else if (state.user.profileImage.startsWith('/uploads/')) {
          imageUrl = `http://localhost:3001${state.user.profileImage}`;
        } else {
          imageUrl = `http://localhost:3001/uploads/profiles/${state.user.profileImage}`;
        }
        console.log('🖼️ Cargando imagen de perfil:', {
          originalImage: state.user.profileImage,
          finalUrl: imageUrl
        });
        setPreviewImage(imageUrl);
      } else {
        console.log('🖼️ No hay imagen de perfil válida, usando imagen por defecto');
        setPreviewImage(lugoPerfilImage);
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
            fontWeight: 600,
            textAlign: 'center'
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
            {/* Foto de perfil - Estructura original restaurada */}
            <Grid item xs={12} md={2}>
              <Box display="flex" flexDirection="column" alignItems="center" sx={{ ml: 4 }}>
                <Box sx={{ position: 'relative', mb: 2 }}>
                  <Avatar
                    src={previewImage || lugoPerfilImage}
                    sx={{ 
                      width: { xs: 156, sm: 195 }, // 30% más grande: 120*1.3=156, 150*1.3=195
                      height: { xs: 156, sm: 195 }, 
                      border: `3px solid ${colors.primary[200]}`,
                      boxShadow: '0 4px 12px rgba(20, 184, 166, 0.15)',
                      fontSize: { xs: '2.6rem', sm: '3.25rem' } // 30% más grande: 2*1.3=2.6, 2.5*1.3=3.25
                    }}
                    onLoad={() => console.log('✅ Imagen de perfil cargada correctamente:', previewImage || lugoPerfilImage)}
                    onError={(e) => {
                      console.log('❌ Error al cargar imagen de perfil, usando imagen por defecto');
                      setPreviewImage(lugoPerfilImage);
                    }}
                  >
                    {state.user.nickname.charAt(0).toUpperCase()}
                  </Avatar>
                  
                  {/* Iconos de reputación - Regalito */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -6.5, // 30% más grande: -5*1.3=-6.5
                      left: -6.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.3, // 30% más grande: 1*1.3=1.3
                      backgroundColor: colors.background.card,
                      padding: '5.2px 10.4px', // 30% más grande: 4*1.3=5.2, 8*1.3=10.4
                      borderRadius: 2.6, // 30% más grande: 2*1.3=2.6
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
                        bottom: -6.5, // 30% más grande: -5*1.3=-6.5
                        right: -6.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.3, // 30% más grande: 1*1.3=1.3
                        backgroundColor: colors.background.card,
                        padding: '5.2px 10.4px', // 30% más grande: 4*1.3=5.2, 8*1.3=10.4
                        borderRadius: 2.6, // 30% más grande: 2*1.3=2.6
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
                    sx={{ 
                      backgroundColor: colors.primary[100],
                      transform: 'scale(1.3)', // 30% más grande
                      '&:hover': {
                        backgroundColor: colors.primary[200],
                      }
                    }}
                  >
                    <PhotoCamera />
                  </IconButton>
                </label>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.04rem' }}> {/* 30% más grande: 0.8*1.3=1.04 */}
                  Cambiar foto
                </Typography>
              </Box>
            </Grid>

            {/* Formulario - Zona roja reorganizada */}
            <Grid item xs={12} md={10}>
              <Box 
                sx={{ 
                  p: 5, // Aumentado a 5 para más espacio
                  backgroundColor: colors.background.card,
                  borderRadius: 2,
                  border: `2px solid ${colors.primary[200]}`,
                  position: 'relative', // Para posicionar la animación
                  minHeight: 500, // Altura mínima para el contenedor
                  width: '100%', // Asegurar ancho completo
                  maxWidth: 'none', // Remover limitación de ancho
                }}
              >
                {/* Animación flotante alineada con la foto del perfil */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -380,
                    right: -120,
                    zIndex: 10,
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
                  <Box
                    component="img"
                    src={lugoPerfilImage}
                    alt="Imagen decorativa de perfil"
                    sx={{
                      width: { xs: 375, sm: 500, md: 625 },
                      height: 'auto',
                      filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1))',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.15))',
                      },
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Línea 1: Nickname + Nombre Real */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                      <TextField
                        fullWidth
                        label="Nickname"
                        {...register('nickname')}
                        error={!!errors.nickname}
                        helperText={errors.nickname?.message}
                      />
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                      <TextField
                        fullWidth
                        label="Nombre Real"
                        {...register('realName')}
                        error={!!errors.realName}
                        helperText={errors.realName?.message}
                      />
                    </Box>
                  </Box>
                  
                  {/* Línea 2: Edad + Fecha de Nacimiento + Sexo */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: '1 1 200px', minWidth: '150px' }}>
                      <TextField
                        fullWidth
                        label="Edad"
                        type="number"
                        {...register('age')}
                        error={!!errors.age}
                        helperText={errors.age?.message}
                      />
                    </Box>
                    <Box sx={{ flex: '1 1 200px', minWidth: '150px' }}>
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
                    </Box>
                    <Box sx={{ flex: '1 1 200px', minWidth: '150px' }}>
                      <TextField
                        fullWidth
                        label="Sexo"
                        select
                        SelectProps={{
                          native: true,
                        }}
                        {...register('gender')}
                        error={!!errors.gender}
                        helperText={errors.gender?.message}
                      >
                        <option value="">Seleccionar</option>
                        <option value="mujer">Mujer</option>
                        <option value="hombre">Hombre</option>
                        <option value="no_binario">No binario</option>
                        <option value="no_definido">No definido</option>
                        <option value="prefiero_no_decirlo">Prefiero no decirlo</option>
                      </TextField>
                    </Box>
                  </Box>
                  
                  {/* Línea 3: Ciudad + Provincia + País */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'nowrap' }}>
                    <Box sx={{ flex: '1 1 0', minWidth: '120px' }}>
                      <TextField
                        fullWidth
                        label="Ciudad/Lugar"
                        {...register('city')}
                        error={!!errors.city}
                        helperText={errors.city?.message}
                      />
                    </Box>
                    <Box sx={{ flex: '1 1 0', minWidth: '120px' }}>
                      <TextField
                        fullWidth
                        label="Provincia"
                        {...register('province')}
                        error={!!errors.province}
                        helperText={errors.province?.message}
                      />
                    </Box>
                    <Box sx={{ flex: '1 1 0', minWidth: '120px' }}>
                      <TextField
                        fullWidth
                        label="País"
                        {...register('country')}
                        error={!!errors.country}
                        helperText={errors.country?.message}
                      />
                    </Box>
                  </Box>
                  
                  {/* Línea 4: Dirección Postal + Aclaración */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                      <TextField
                        fullWidth
                        label="Dirección Postal (Opcional)"
                        {...register('postalAddress')}
                        error={!!errors.postalAddress}
                        helperText={errors.postalAddress?.message}
                      />
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                      <TextField
                        fullWidth
                        label="Aclaración (Detalles de vivienda)"
                        {...register('addressDetails')}
                        error={!!errors.addressDetails}
                        helperText={errors.addressDetails?.message}
                      />
                    </Box>
                  </Box>
                  
                  {/* Línea 5: Sub-perfiles */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'end' }}>
                    <Box sx={{ flex: '1 1 150px', minWidth: '120px' }}>
                      <TextField
                        fullWidth
                        label="Número de Sub-perfiles"
                        type="number"
                        inputProps={{ min: 0, max: 10 }}
                        {...register('subProfilesCount')}
                        error={!!errors.subProfilesCount}
                        helperText={errors.subProfilesCount?.message}
                      />
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '200px' }}>
                      <TextField
                        fullWidth
                        label="Listado de Sub-perfiles"
                        select
                        SelectProps={{
                          native: true,
                          displayEmpty: true,
                        }}
                        {...register('selectedSubProfile')}
                        error={!!errors.selectedSubProfile}
                        helperText={errors.selectedSubProfile?.message}
                        sx={{ 
                          '& .MuiInputLabel-root': {
                            backgroundColor: 'white',
                            padding: '0 8px',
                          },
                          '& .MuiSelect-select': {
                            backgroundColor: 'white',
                          }
                        }}
                      >
                        <option value="" disabled>Seleccionar sub-perfil</option>
                        {/* Aquí se cargarán dinámicamente los sub-perfiles */}
                      </TextField>
                    </Box>
                    <Box sx={{ flex: '0 0 auto' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ height: '56px', minWidth: '120px' }}
                        onClick={() => {
                          // TODO: Implementar ventana de registro de sub-perfil
                          console.log('Abrir ventana de agregar sub-perfil');
                        }}
                      >
                        AGREGAR
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                backgroundColor: colors.primary[500],
                '&:hover': {
                  backgroundColor: colors.primary[600],
                }
              }}
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
