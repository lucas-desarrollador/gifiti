import React from 'react';
import { Tabs, Tab, Box, Container } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES, NAVIGATION_TABS } from '../../constants';
import { colors } from '../../theme';

const NavigationTabs: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determinar el tab activo basado en la ruta actual
  const getActiveTab = (): string => {
    const path = location.pathname;
    
    if (path.startsWith(ROUTES.PROFILE)) return NAVIGATION_TABS.PROFILE;
    if (path.startsWith(ROUTES.WISHES)) return NAVIGATION_TABS.WISHES;
    if (path.startsWith(ROUTES.CONTACTS)) return NAVIGATION_TABS.CONTACTS;
    if (path.startsWith(ROUTES.EXPLORE)) return NAVIGATION_TABS.EXPLORE;
    
    return NAVIGATION_TABS.EXPLORE; // Default
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    switch (newValue) {
      case NAVIGATION_TABS.PROFILE:
        navigate(ROUTES.PROFILE);
        break;
      case NAVIGATION_TABS.WISHES:
        navigate(ROUTES.WISHES);
        break;
      case NAVIGATION_TABS.CONTACTS:
        navigate(ROUTES.CONTACTS);
        break;
      case NAVIGATION_TABS.EXPLORE:
        navigate(ROUTES.EXPLORE);
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ 
      backgroundColor: colors.background.card,
      borderBottom: `1px solid ${colors.border.light}`,
      py: 2
    }}>
      <Container maxWidth="lg">
        <Tabs
          value={getActiveTab()}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            backgroundColor: colors.background.secondary,
            borderRadius: 3,
            p: 0.5,
            '& .MuiTabs-indicator': {
              display: 'none',
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: { xs: '0.8rem', sm: '0.95rem' },
              fontWeight: 600,
              color: colors.text.secondary,
              borderRadius: 2,
              mx: { xs: 0.25, sm: 0.5 },
              minHeight: { xs: 40, sm: 48 },
              transition: 'all 0.2s ease-in-out',
              '&.Mui-selected': {
                color: colors.primary[500],
                backgroundColor: colors.background.card,
                boxShadow: '0 2px 8px rgba(20, 184, 166, 0.15)',
              },
              '&:hover': {
                backgroundColor: colors.primary[50],
                color: colors.primary[600],
              },
            },
          }}
        >
          <Tab
            label="Explorar"
            value={NAVIGATION_TABS.EXPLORE}
          />
          <Tab
            label="Contactos"
            value={NAVIGATION_TABS.CONTACTS}
          />
          <Tab
            label="Top Deseos"
            value={NAVIGATION_TABS.WISHES}
          />
          <Tab
            label="Mi Perfil"
            value={NAVIGATION_TABS.PROFILE}
          />
        </Tabs>
      </Container>
    </Box>
  );
};

export default NavigationTabs;
