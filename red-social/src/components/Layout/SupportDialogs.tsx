import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { colors } from '../../theme';

// Centro de Ayuda
export const HelpDialog: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ backgroundColor: colors.primary[500], color: 'white' }}>
        Centro de Ayuda
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: colors.text.primary }}>
            ¿Necesitas ayuda?
          </Typography>
        </Box>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Si tienes dudas sobre cómo utilizar nuestra plataforma, por favor envíanos tu consulta 
            al siguiente correo y atenderemos tu inquietud lo antes posible:
          </Typography>
        </Alert>
        
        <Box sx={{ 
          backgroundColor: colors.background.secondary, 
          p: 2, 
          borderRadius: 1, 
          textAlign: 'center',
          border: `1px solid ${colors.border.light}`
        }}>
          <Typography variant="h6" sx={{ color: colors.primary[500], fontWeight: 600 }}>
            ayuda.gifiti@klanstart.com
          </Typography>
        </Box>
        
        <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 2, textAlign: 'center' }}>
          Nuestro equipo de soporte está disponible para ayudarte de lunes a viernes de 9:00 a 18:00 hs.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
        <Button onClick={onClose} variant="contained" sx={{ backgroundColor: colors.primary[500] }}>
          Gracias
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Oportunidades de Inversión
export const InvestmentDialog: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ backgroundColor: colors.primary[500], color: 'white' }}>
        Oportunidades de Inversión
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: colors.text.primary }}>
            ¿Eres empresario o emprendedor?
          </Typography>
        </Box>
        
        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Si eres empresario/a o emprendedor/a y deseas ofrecer algún esquema de negocio 
            que trabaje junto a nuestra plataforma, ¡somos todo oídos!
          </Typography>
        </Alert>
        
        <Typography variant="body2" paragraph sx={{ color: colors.text.secondary }}>
          Estamos abiertos a colaboraciones estratégicas, alianzas comerciales y oportunidades 
          de crecimiento mutuo. Si tienes una propuesta interesante, no dudes en contactarnos.
        </Typography>
        
        <Box sx={{ 
          backgroundColor: colors.background.secondary, 
          p: 2, 
          borderRadius: 1, 
          textAlign: 'center',
          border: `1px solid ${colors.border.light}`
        }}>
          <Typography variant="h6" sx={{ color: colors.primary[500], fontWeight: 600 }}>
            inversion.gifiti@klanstart.com
          </Typography>
        </Box>
        
        <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 2, textAlign: 'center' }}>
          Analizaremos cada propuesta con atención y te responderemos en un plazo máximo de 5 días hábiles.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
        <Button onClick={onClose} variant="contained" sx={{ backgroundColor: colors.primary[500] }}>
          Gracias
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Patrocinios
export const SponsorshipDialog: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ backgroundColor: colors.primary[500], color: 'white' }}>
        Patrocinios
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: colors.text.primary }}>
            ¿Quieres promocionar tu marca?
          </Typography>
        </Box>
        
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Si estás interesado en inyectar publicidades de tu negocio o marca en nuestra plataforma, 
            por favor comunícate con nosotros.
          </Typography>
        </Alert>
        
        <Typography variant="body2" paragraph sx={{ color: colors.text.secondary }}>
          Ofrecemos diferentes opciones de publicidad y patrocinio que se adaptan a tu presupuesto 
          y objetivos de marketing. Desde banners hasta contenido patrocinado, tenemos soluciones 
          para cada tipo de negocio.
        </Typography>
        
        <Box sx={{ 
          backgroundColor: colors.background.secondary, 
          p: 2, 
          borderRadius: 1, 
          textAlign: 'center',
          border: `1px solid ${colors.border.light}`
        }}>
          <Typography variant="h6" sx={{ color: colors.primary[500], fontWeight: 600 }}>
            sponsor.gifiti@klanstart.com
          </Typography>
        </Box>
        
        <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 2, textAlign: 'center' }}>
          Te enviaremos un kit completo con nuestras tarifas y opciones de publicidad disponibles.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
        <Button onClick={onClose} variant="contained" sx={{ backgroundColor: colors.primary[500] }}>
          Gracias
        </Button>
      </DialogActions>
    </Dialog>
  );
};
