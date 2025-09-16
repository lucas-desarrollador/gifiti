import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Block as BlockIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { colors } from '../../theme';

interface DeleteContactDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  onBlockAndDelete: () => void;
  contactName: string;
  loading?: boolean;
}

const DeleteContactDialog: React.FC<DeleteContactDialogProps> = ({
  open,
  onClose,
  onDelete,
  onBlockAndDelete,
  contactName,
  loading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: colors.background.primary,
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ color: colors.text.primary, fontWeight: 600 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon sx={{ color: colors.warning?.[500] || '#f59e0b' }} />
          Eliminar Contacto
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ color: colors.text.primary, mb: 2 }}>
          ¿Qué deseas hacer con <strong>{contactName}</strong>?
        </Typography>

        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Eliminar:</strong> Solo se eliminará la conexión. El contacto podrá volver a enviarte una invitación.
          </Typography>
        </Alert>

        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Bloquear y Eliminar:</strong> Se eliminará la conexión y se bloqueará permanentemente. No podrás volver a contactar con esta persona.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{ color: colors.text.secondary }}
        >
          Cancelar
        </Button>
        
        <Button
          onClick={onDelete}
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          disabled={loading}
          sx={{ 
            color: colors.error?.[600] || '#d32f2f',
            borderColor: colors.error?.[600] || '#d32f2f',
            '&:hover': {
              backgroundColor: colors.error?.[50] || '#ffebee',
              borderColor: colors.error?.[700] || '#c62828',
            }
          }}
        >
          Eliminar
        </Button>

        <Button
          onClick={onBlockAndDelete}
          variant="contained"
          color="error"
          startIcon={<BlockIcon />}
          disabled={loading}
          sx={{
            backgroundColor: colors.error?.[600] || '#d32f2f',
            '&:hover': {
              backgroundColor: colors.error?.[700] || '#c62828',
            }
          }}
        >
          Bloquear y Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteContactDialog;
