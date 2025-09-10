import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Link, 
  Grid, 
  Divider,
  IconButton
} from '@mui/material';
import { 
  Email, 
  LocationOn, 
  Business, 
  Help,
  Gavel,
  AttachMoney
} from '@mui/icons-material';
import { colors } from '../../theme';
import { TermsDialog, PrivacyDialog, ComplaintsDialog } from './LegalDialogs';
import { HelpDialog, InvestmentDialog, SponsorshipDialog } from './SupportDialogs';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  // Estados para los diálogos
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [complaintsOpen, setComplaintsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [investmentOpen, setInvestmentOpen] = useState(false);
  const [sponsorshipOpen, setSponsorshipOpen] = useState(false);

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: colors.background.primary,
        borderTop: `1px solid ${colors.border.light}`,
        mt: 'auto',
        py: 2
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 2
        }}>
          {/* Información de la empresa */}
          <Box sx={{ flex: '1', minWidth: '250px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Business sx={{ color: colors.primary[500], mr: 1, fontSize: 18 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.text.primary, fontSize: '0.95rem' }}>
                KlanStart Studio
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontSize: '0.75rem' }}>
              Desarrollando la próxima generación de redes sociales
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <LocationOn sx={{ color: colors.text.tertiary, mr: 0.5, fontSize: 14 }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                Buenos Aires, Argentina
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Email sx={{ color: colors.text.tertiary, mr: 0.5, fontSize: 14 }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                contacto@klanstart.com
              </Typography>
            </Box>
          </Box>

          {/* Enlaces legales - Centro */}
          <Box sx={{ flex: '1', minWidth: '200px', textAlign: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.text.primary, mb: 1, fontSize: '0.95rem' }}>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.75rem', 
                  color: colors.text.tertiary, 
                  cursor: 'pointer', 
                  '&:hover': { color: colors.text.primary, textDecoration: 'underline' } 
                }}
                onClick={() => setTermsOpen(true)}
              >
                Términos y Condiciones
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.75rem', 
                  color: colors.text.tertiary, 
                  cursor: 'pointer', 
                  '&:hover': { color: colors.text.primary, textDecoration: 'underline' } 
                }}
                onClick={() => setPrivacyOpen(true)}
              >
                Política de Privacidad
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.75rem', 
                  color: colors.text.tertiary, 
                  cursor: 'pointer', 
                  '&:hover': { color: colors.text.primary, textDecoration: 'underline' } 
                }}
                onClick={() => setComplaintsOpen(true)}
              >
                Libro de Quejas Online
              </Typography>
            </Box>
          </Box>

          {/* Soporte y negocios - Derecha */}
          <Box sx={{ flex: '1', minWidth: '250px', textAlign: 'right' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.text.primary, mb: 1, fontSize: '0.95rem' }}>
              Soporte & Negocios
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'flex-end', 
                  cursor: 'pointer',
                  '&:hover': { color: colors.text.primary }
                }}
                onClick={() => setHelpOpen(true)}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '0.75rem', 
                    color: colors.text.tertiary, 
                    '&:hover': { color: colors.text.primary, textDecoration: 'underline' } 
                  }}
                >
                  Centro de Ayuda
                </Typography>
                <Help sx={{ fontSize: 14, ml: 0.5, color: colors.text.tertiary }} />
              </Box>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'flex-end', 
                  cursor: 'pointer',
                  '&:hover': { color: colors.text.primary }
                }}
                onClick={() => setInvestmentOpen(true)}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '0.75rem', 
                    color: colors.text.tertiary, 
                    '&:hover': { color: colors.text.primary, textDecoration: 'underline' } 
                  }}
                >
                  Oportunidades de Inversión
                </Typography>
                <AttachMoney sx={{ fontSize: 14, ml: 0.5, color: colors.text.tertiary }} />
              </Box>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'flex-end', 
                  cursor: 'pointer',
                  '&:hover': { color: colors.text.primary }
                }}
                onClick={() => setSponsorshipOpen(true)}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '0.75rem', 
                    color: colors.text.tertiary, 
                    '&:hover': { color: colors.text.primary, textDecoration: 'underline' } 
                  }}
                >
                  Patrocinios
                </Typography>
                <Business sx={{ fontSize: 14, ml: 0.5, color: colors.text.tertiary }} />
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Copyright */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1
        }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            Copyright © {currentYear} KlanStart Studio. Todos los derechos reservados.
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            Hecho con ❤️ en Argentina
          </Typography>
        </Box>
      </Container>
      
      {/* Diálogos */}
      <TermsDialog open={termsOpen} onClose={() => setTermsOpen(false)} />
      <PrivacyDialog open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <ComplaintsDialog open={complaintsOpen} onClose={() => setComplaintsOpen(false)} />
      <HelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
      <InvestmentDialog open={investmentOpen} onClose={() => setInvestmentOpen(false)} />
      <SponsorshipDialog open={sponsorshipOpen} onClose={() => setSponsorshipOpen(false)} />
    </Box>
  );
};

export default Footer;
