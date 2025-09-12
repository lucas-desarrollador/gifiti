import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Divider,
  Alert,
  IconButton,
} from '@mui/material';
import {
  Close,
  Warning,
  Delete,
} from '@mui/icons-material';
import { colors } from '../../theme';
import { useAuth } from '../../context/AuthContext';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
  const { state, logout } = useAuth();
  const [anticipation, setAnticipation] = useState<number>(5);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cargar preferencias del usuario al abrir el diálogo
  useEffect(() => {
    if (open && state.user) {
      // En el futuro, esto vendrá de la API
      const savedAnticipation = localStorage.getItem(`anticipation_${state.user.id}`);
      if (savedAnticipation) {
        setAnticipation(parseInt(savedAnticipation));
      }
    }
  }, [open, state.user]);

  const handleAnticipationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setAnticipation(value);
    
    // Guardar preferencia
    if (state.user) {
      localStorage.setItem(`anticipation_${state.user.id}`, value.toString());
    }
  };

  const handleDeleteAccount = async () => {
    if (!state.user) return;

    setIsDeleting(true);
    try {
      // TODO: Implementar llamada a la API para eliminar cuenta
      console.log('Eliminando cuenta del usuario:', state.user.id);
      
      // Simular llamada a la API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Cerrar sesión y redirigir
      await logout();
      onClose();
      
      // Mostrar mensaje de confirmación
      alert('Tu cuenta ha sido eliminada exitosamente');
      
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
      alert('Error al eliminar la cuenta. Por favor, inténtalo de nuevo.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleClose = () => {
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Configuración
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* Sección de Anticipación */}
        <Box
          sx={{
            border: `1px solid ${colors.border.light}`,
            borderRadius: 1,
            p: 3,
            backgroundColor: colors.background.secondary,
            mb: 4,
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Anticipación de Cumpleaños
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: colors.text.secondary }}>
            Selecciona con cuántos días de anticipación quieres que te notifiquemos 
            sobre los cumpleaños de tus contactos.
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: colors.text.tertiary, 
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                minWidth: 'fit-content'
              }}
            >
              Días
            </Typography>
            
            <FormControl component="fieldset" sx={{ flex: 1 }}>
              <RadioGroup
                value={anticipation}
                onChange={handleAnticipationChange}
                sx={{ 
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 0,
                  justifyContent: 'space-between'
                }}
              >
                {[1, 10, 20, 40, 65].map((days) => (
                  <FormControlLabel
                    key={days}
                    value={days}
                    control={<Radio size="small" />}
                    label={days}
                    sx={{
                      margin: 0,
                      '& .MuiFormControlLabel-label': {
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: colors.text.primary,
                      },
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Sección de Eliminar Cuenta */}
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: colors.status.error }}>
            Zona de Peligro
          </Typography>
          
          {!showDeleteConfirm ? (
            <Box>
              <Typography variant="body2" sx={{ mb: 2, color: colors.text.secondary }}>
                Una vez que elimines tu cuenta, no podrás recuperarla. Se eliminarán 
                todos tus datos, deseos, contactos y configuraciones.
              </Typography>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => setShowDeleteConfirm(true)}
                sx={{ borderColor: colors.status.error }}
              >
                Eliminar Cuenta
              </Button>
            </Box>
          ) : (
            <Box>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  ¿Estás seguro de que quieres eliminar tu cuenta?
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Esta acción no se puede deshacer. Se eliminarán permanentemente:
                </Typography>
                <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                  <li>Tu perfil y datos personales</li>
                  <li>Todos tus deseos</li>
                  <li>Tu lista de contactos</li>
                  <li>Tus configuraciones y preferencias</li>
                </Box>
              </Alert>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  startIcon={isDeleting ? <Warning /> : <Delete />}
                >
                  {isDeleting ? 'Eliminando...' : 'Sí, eliminar cuenta'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={handleClose} variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
