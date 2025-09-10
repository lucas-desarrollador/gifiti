import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import WishesPage from './pages/WishesPage';
import ContactsPage from './pages/ContactsPage';
import ExplorePage from './pages/ExplorePage';
import GoogleAuthCallback from './pages/GoogleAuthCallback';
import { ROUTES } from './constants';
import { theme } from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppProvider>
          <Router>
            <Layout>
              <Routes>
                {/* Rutas públicas */}
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
                
                {/* Rutas protegidas */}
                <Route
                  path={ROUTES.PROFILE}
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.WISHES}
                  element={
                    <ProtectedRoute>
                      <WishesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.CONTACTS}
                  element={
                    <ProtectedRoute>
                      <ContactsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.EXPLORE}
                  element={
                    <ProtectedRoute>
                      <ExplorePage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Ruta por defecto */}
                <Route
                  path={ROUTES.HOME}
                  element={<Navigate to={ROUTES.PROFILE} replace />}
                />
                
                {/* Ruta 404 */}
                <Route path="*" element={<Navigate to={ROUTES.PROFILE} replace />} />
              </Routes>
            </Layout>
          </Router>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;