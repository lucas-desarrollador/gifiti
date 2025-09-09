import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Alert,
} from '@mui/material';
import { Close, PhotoCamera } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Wish, WishForm } from '../../types';
import { VALIDATION_RULES } from '../../constants';

const schema = yup.object({
  title: yup
    .string()
    .max(VALIDATION_RULES.WISH_TITLE_MAX_LENGTH, `El título no puede tener más de ${VALIDATION_RULES.WISH_TITLE_MAX_LENGTH} caracteres`)
    .required('El título es requerido'),
  description: yup
    .string()
    .max(VALIDATION_RULES.WISH_DESCRIPTION_MAX_LENGTH, `La descripción no puede tener más de ${VALIDATION_RULES.WISH_DESCRIPTION_MAX_LENGTH} caracteres`)
    .required('La descripción es requerida'),
  purchaseLink: yup
    .string()
    .url('Debe ser una URL válida')
    .optional(),
});

interface WishFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: WishForm) => void;
  wish?: Wish | null;
  isEditing?: boolean;
}

const WishFormDialog: React.FC<WishFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  wish,
  isEditing = false,
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<WishForm>({
    resolver: yupResolver(schema),
  });

  const description = watch('description', '');

  // Resetear formulario cuando se abre/cierra el dialog
  useEffect(() => {
    if (open) {
      if (wish) {
        reset({
          title: wish.title,
          description: wish.description,
          purchaseLink: wish.purchaseLink || '',
        });
        setPreviewImage(wish.image || '');
      } else {
        reset({
          title: '',
          description: '',
          purchaseLink: '',
        });
        setPreviewImage('');
      }
      setImageFile(null);
      setError('');
    }
  }, [open, wish, reset]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tamaño del archivo
      if (file.size > 20 * 1024 * 1024) { // 20MB
        setError('La imagen no puede ser mayor a 20MB');
        return;
      }

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setError('El archivo debe ser una imagen');
        return;
      }

      setImageFile(file);
      setError('');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (data: WishForm) => {
    setError('');
    const formData: WishForm = {
      ...data,
      image: imageFile || undefined,
    };
    onSubmit(formData);
  };

  const handleClose = () => {
    reset();
    setImageFile(null);
    setPreviewImage('');
    setError('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '500px' }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {isEditing ? 'Editar Deseo' : 'Agregar Nuevo Deseo'}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
          <TextField
            fullWidth
            label="Título del deseo"
            margin="normal"
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            fullWidth
            label="Descripción"
            multiline
            rows={4}
            margin="normal"
            {...register('description')}
            error={!!errors.description}
            helperText={`${description.length}/${VALIDATION_RULES.WISH_DESCRIPTION_MAX_LENGTH} caracteres`}
          />

          <TextField
            fullWidth
            label="Link de compra (opcional)"
            margin="normal"
            placeholder="https://ejemplo.com/producto"
            {...register('purchaseLink')}
            error={!!errors.purchaseLink}
            helperText={errors.purchaseLink?.message}
          />

          {/* Upload de imagen */}
          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>
              Imagen del deseo (opcional)
            </Typography>
            
            {previewImage && (
              <Box mb={2}>
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                  }}
                />
              </Box>
            )}

            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="wish-image-upload"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="wish-image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCamera />}
                size="small"
              >
                {previewImage ? 'Cambiar imagen' : 'Subir imagen'}
              </Button>
            </label>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
        >
          {isEditing ? 'Actualizar' : 'Agregar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WishFormDialog;
