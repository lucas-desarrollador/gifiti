import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  TextField,
  Alert
} from '@mui/material';
import { colors } from '../../theme';
import { useAuth } from '../../context/AuthContext';

// Términos y Condiciones
export const TermsDialog: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ backgroundColor: colors.primary[500], color: 'white' }}>
        Términos y Condiciones
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: colors.text.primary }}>
          Términos y Condiciones de Uso de GiFiTi
        </Typography>
        
        <Typography variant="body2" paragraph sx={{ color: colors.text.secondary }}>
          <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES')}
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ color: colors.text.primary, mt: 2 }}>
          1. Aceptación de los Términos
        </Typography>
        <Typography variant="body2" paragraph sx={{ color: colors.text.secondary }}>
          Al acceder y utilizar GiFiTi, usted acepta cumplir con estos términos y condiciones. 
          Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestra plataforma.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ color: colors.text.primary }}>
          2. Descripción del Servicio
        </Typography>
        <Typography variant="body2" paragraph sx={{ color: colors.text.secondary }}>
          GiFiTi es una red social centrada en el intercambio de deseos y regalos, 
          diseñada para conectar personas y facilitar la realización de deseos a través de una comunidad solidaria.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ color: colors.text.primary }}>
          3. Cuenta de Usuario
        </Typography>
        <Typography variant="body2" paragraph sx={{ color: colors.text.secondary }}>
          Para utilizar nuestros servicios, debe crear una cuenta proporcionando información veraz y actualizada. 
          Es responsable de mantener la confidencialidad de su cuenta y contraseña.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ color: colors.text.primary }}>
          4. Uso Aceptable
        </Typography>
        <Typography variant="body2" paragraph sx={{ color: colors.text.secondary }}>
          Se compromete a utilizar GiFiTi de manera responsable, respetando a otros usuarios y cumpliendo 
          con todas las leyes aplicables. No está permitido el contenido ofensivo, ilegal o que viole derechos de terceros.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ color: colors.text.primary }}>
          5. Privacidad
        </Typography>
        <Typography variant="body2" paragraph sx={{ color: colors.text.secondary }}>
          Su privacidad es importante para nosotros. Consulte nuestra Política de Privacidad para 
          entender cómo recopilamos, usamos y protegemos su información.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ color: colors.text.primary }}>
          6. Modificaciones
        </Typography>
        <Typography variant="body2" paragraph sx={{ color: colors.text.secondary }}>
          Nos reservamos el derecho de modificar estos términos en cualquier momento. 
          Las modificaciones entrarán en vigor inmediatamente después de su publicación en la plataforma.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ color: colors.text.primary }}>
          7. Contacto
        </Typography>
        <Typography variant="body2" paragraph sx={{ color: colors.text.secondary }}>
          Si tiene preguntas sobre estos términos, puede contactarnos en: legales.gifiti@klanstart.com
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" sx={{ backgroundColor: colors.primary[500] }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Política de Privacidad
export const PrivacyDialog: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ backgroundColor: colors.primary[500], color: 'white' }}>
        Política de Privacidad
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: colors.text.primary }}>
          Política de Privacidad de GiFiTi
        </Typography>
        
        <Typography variant="body2" paragraph sx={{ color: colors.text.secondary }}>
          <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES')}
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ color: colors.text.primary, mt: 2 }}>
          1. Información que Recopilamos
        </Typography>
        <Typography variant="body2" paragraph sx={{ color: colors.text.secondary }}>
          Recopilamos información que nos proporciona directamente, como su nombre, dirección de correo electrónico, 
          información de perfil y cualquier contenido que publique en nuestra plataforma.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ color: colors.text.primary }}>
          2. Cómo Utilizamos su Información
        </Typography>
        <Typography variant="body2" paragraph sx={{ color: colors.text.secondary }}>
          Utilizamos su información para proporcionar, mantener y mejorar nuestros servicios, 
          comunicarnos con usted y personalizar su experiencia en la plataforma.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ color: colors.text.primary }}>
          3. Compartir Información
        </Typography>
        <Typography variant="body2" paragraph sx={{ color: colors.text.secondary }}>
          No vendemos, alquilamos ni compartimos su información personal con terceros, 
          excepto en las circunstancias descritas en esta política o con su consentimiento explícito.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ color: colors.text.primary }}>
          4. Seguridad de Datos
        </Typography>
        <Typography variant="body2" paragraph sx={{ color: colors.text.secondary }}>
          Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger 
          su información personal contra acceso no autorizado, alteración, divulgación o destrucción.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ color: colors.text.primary }}>
          5. Sus Derechos
        </Typography>
        <Typography variant="body2" paragraph sx={{ color: colors.text.secondary }}>
          Tiene derecho a acceder, corregir, eliminar o portar su información personal. 
          También puede retirar su consentimiento en cualquier momento.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ color: colors.text.primary }}>
          6. Cookies y Tecnologías Similares
        </Typography>
        <Typography variant="body2" paragraph sx={{ color: colors.text.secondary }}>
          Utilizamos cookies y tecnologías similares para mejorar su experiencia, 
          analizar el uso de la plataforma y personalizar el contenido.
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ color: colors.text.primary }}>
          7. Contacto
        </Typography>
        <Typography variant="body2" paragraph sx={{ color: colors.text.secondary }}>
          Si tiene preguntas sobre esta política de privacidad, puede contactarnos en: legales.gifiti@klanstart.com
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" sx={{ backgroundColor: colors.primary[500] }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Libro de Quejas
export const ComplaintsDialog: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { state } = useAuth();
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (message.trim()) {
      // Aquí se enviaría el mensaje al backend
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setMessage('');
        onClose();
      }, 2000);
    }
  };

  if (!state.isAuthenticated) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: colors.primary[500], color: 'white' }}>
          Libro de Quejas Online
        </DialogTitle>
        <DialogContent sx={{ p: 3, textAlign: 'center' }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Para enviar una queja o reclamo, debe estar registrado en nuestra plataforma.
          </Alert>
          <Typography variant="body1" sx={{ color: colors.text.secondary }}>
            Por favor, inicie sesión o regístrese para acceder al formulario de quejas.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
          <Button onClick={onClose} variant="contained" sx={{ backgroundColor: colors.primary[500] }}>
            Entendido
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ backgroundColor: colors.primary[500], color: 'white' }}>
        Libro de Quejas Online
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {submitted ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Su queja ha sido enviada correctamente. Nos pondremos en contacto con usted a la brevedad.
          </Alert>
        ) : (
          <>
            <Typography variant="body1" paragraph sx={{ color: colors.text.secondary }}>
              Si tiene alguna queja, reclamo o sugerencia sobre nuestros servicios, 
              por favor complete el siguiente formulario. Nos comprometemos a responder 
              a todas las consultas en un plazo máximo de 48 horas.
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Describa su queja o reclamo"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Por favor, sea específico y detallado en su descripción..."
              sx={{ mt: 2 }}
            />
            
            <Typography variant="caption" sx={{ color: colors.text.tertiary, mt: 1, display: 'block' }}>
              Su mensaje será enviado a: reclamo.gifiti@klanstart.com
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        {!submitted && (
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={!message.trim()}
            sx={{ backgroundColor: colors.primary[500] }}
          >
            Enviar Queja
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
