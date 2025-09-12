import React, { ReactNode } from 'react';
import { Box, AppBar, Toolbar, Typography, Container, IconButton } from '@mui/material';
import { CardGiftcard, Notifications } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { APP_NAME } from '../../constants';
import NavigationTabs from './NavigationTabs';
import UserMenu from './UserMenu';
import Footer from './Footer';
import UserCounter from './UserCounter';
import BirthdayNotificationsBell from './BirthdayNotificationsBell';
import { colors } from '../../theme';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state } = useAuth();

  if (!state.isAuthenticated) {
    return (
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        <Box sx={{ flexGrow: 1 }}>
          {children}
        </Box>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      {/* Header profesional con gradiente */}
      <AppBar 
        position="static" 
        sx={{ 
          background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
          boxShadow: '0 4px 20px rgba(20, 184, 166, 0.15)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          {/* Logo y nombre de la marca */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 0.5, sm: 1 },
              mr: { xs: 1, sm: 2 }
            }}>
              <CardGiftcard sx={{ 
                fontSize: { xs: 28, sm: 32 }, 
                color: 'white' 
              }} />
            </Box>
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                color: 'white',
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.5rem', sm: '1.75rem' }
              }}
            >
              {APP_NAME}
            </Typography>
          </Box>

          {/* Contador de usuarios */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            mr: 3
          }}>
            <UserCounter />
          </Box>

          {/* Notificaciones y menú de usuario */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Campanita de cumpleaños */}
            <BirthdayNotificationsBell />
            <UserMenu />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Tabs */}
      <NavigationTabs />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
          {children}
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Layout;
