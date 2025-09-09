import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import {
  Add,
  PersonAdd,
  Check,
  Close,
  Cake,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { ContactService } from '../services/contactService';
import { Contact, User } from '../types';
import { colors } from '../theme';

const ContactsPage: React.FC = () => {
  const { state } = useAuth();
  const { state: appState, setContacts, addContact, updateContact, removeContact } = useApp();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Cargar contactos al montar el componente
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      const contacts = await ContactService.getContactsByBirthday();
      setContacts(contacts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los contactos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchUsers = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await ContactService.searchUsersToAdd(searchQuery);
      setSearchResults(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar usuarios');
    }
  };

  const handleSendContactRequest = async (userId: string) => {
    try {
      const contact = await ContactService.sendContactRequest(userId);
      addContact(contact);
      setSearchResults(searchResults.filter(user => user.id !== userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar solicitud');
    }
  };

  const handleAcceptRequest = async (contactId: string) => {
    try {
      const contact = await ContactService.acceptContactRequest(contactId);
      updateContact(contact);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al aceptar solicitud');
    }
  };

  const handleRejectRequest = async (contactId: string) => {
    try {
      await ContactService.rejectContactRequest(contactId);
      removeContact(contactId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al rechazar solicitud');
    }
  };

  const getNextBirthday = (birthDate: string): Date => {
    const today = new Date();
    const birthday = new Date(birthDate);
    birthday.setFullYear(today.getFullYear());
    
    if (birthday < today) {
      birthday.setFullYear(today.getFullYear() + 1);
    }
    
    return birthday;
  };

  const getDaysUntilBirthday = (birthDate: string): number => {
    const nextBirthday = getNextBirthday(birthDate);
    const today = new Date();
    const diffTime = nextBirthday.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatBirthdayInfo = (birthDate: string): string => {
    const days = getDaysUntilBirthday(birthDate);
    const nextBirthday = getNextBirthday(birthDate);
    
    if (days === 0) {
      return '¡Hoy es su cumpleaños!';
    } else if (days === 1) {
      return 'Mañana es su cumpleaños';
    } else if (days <= 7) {
      return `Cumpleaños en ${days} días`;
    } else {
      return `Cumpleaños: ${nextBirthday.toLocaleDateString()}`;
    }
  };

  if (!state.user) {
    return (
      <Container>
        <Typography>No se pudo cargar la información del usuario.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
      <Paper 
        elevation={3} 
        sx={{ 
          padding: { xs: 2, sm: 4 }, 
          mt: { xs: 2, sm: 3 },
          borderRadius: 3,
          background: colors.background.card,
          border: `1px solid ${colors.border.light}`
        }}
      >
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mb={3}
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={{ xs: 2, sm: 0 }}
        >
          <Typography 
            variant="h4"
            sx={{ 
              fontSize: { xs: '1.75rem', sm: '2.125rem' },
              color: colors.text.primary,
              fontWeight: 600
            }}
          >
            Contactos
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setIsAddDialogOpen(true)}
          >
            Agregar Contacto
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {appState.contacts.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aún no tienes contactos
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Agrega contactos para ver sus cumpleaños y deseos
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {appState.contacts
              .filter(contact => contact.status === 'accepted')
              .map((contact) => (
                <Grid item xs={12} sm={6} md={4} key={contact.id}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar
                          src={contact.contact.profileImage}
                          sx={{ width: 60, height: 60, mr: 2 }}
                        >
                          {contact.contact.nickname.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="h6">
                            {contact.contact.nickname}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {contact.contact.realName}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Cake fontSize="small" color="primary" />
                        <Typography variant="body2">
                          {formatBirthdayInfo(contact.contact.birthDate)}
                        </Typography>
                      </Box>
                      
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        onClick={() => {
                          // TODO: Navegar a perfil del contacto
                          console.log('Ver perfil de', contact.contact.nickname);
                        }}
                      >
                        Ver Deseos
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        )}
      </Paper>

      {/* Dialog para agregar contactos */}
      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Agregar Nuevo Contacto</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Buscar por nickname o email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            margin="normal"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearchUsers();
              }
            }}
          />
          
          <Button
            variant="outlined"
            onClick={handleSearchUsers}
            sx={{ mt: 1 }}
          >
            Buscar
          </Button>

          {searchResults.length > 0 && (
            <List sx={{ mt: 2 }}>
              {searchResults.map((user) => (
                <ListItem key={user.id}>
                  <ListItemAvatar>
                    <Avatar src={user.profileImage}>
                      {user.nickname.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.nickname}
                    secondary={user.realName}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleSendContactRequest(user.id)}
                    >
                      <PersonAdd />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ContactsPage;
