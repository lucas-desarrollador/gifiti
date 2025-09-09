import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Avatar,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { EXPLORE_TYPES } from '../constants';

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleExploreUsers = () => {
    navigate('/explore/users');
  };

  const handleExploreWishes = () => {
    navigate('/explore/wishes');
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 4, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Explorar
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Descubre nuevos usuarios y deseos interesantes
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Usuarios" />
            <Tab label="Deseos" />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Explorar Usuarios
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Descubre usuarios cercanos y de todo el mundo
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Usuarios Cercanos
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Encuentra personas cerca de tu ubicación
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handleExploreUsers}
                      fullWidth
                    >
                      Explorar Usuarios
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Usuarios Aleatorios
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Conoce personas de todo el mundo
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={handleExploreUsers}
                      fullWidth
                    >
                      Ver Aleatorios
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Explorar Deseos
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Descubre deseos interesantes de otros usuarios
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Deseos Populares
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Los deseos más populares entre los usuarios
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handleExploreWishes}
                      fullWidth
                    >
                      Ver Deseos Populares
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Deseos Recientes
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Los deseos más recientes agregados
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={handleExploreWishes}
                      fullWidth
                    >
                      Ver Deseos Recientes
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ExplorePage;
