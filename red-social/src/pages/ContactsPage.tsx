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
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  PersonAdd,
  Check,
  Close,
  Cake,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { ContactService } from '../services/contactService';
import { Contact, User } from '../types';
import { colors } from '../theme';
import ContactProfileModal from '../components/Contacts/ContactProfileModal';
import ContactWishesModal from '../components/Contacts/ContactWishesModal';
import DeleteContactDialog from '../components/Contacts/DeleteContactDialog';
import { getProfileImageUrl } from '../utils/imageUtils';

const ContactsPage: React.FC = () => {
  const { state } = useAuth();
  const { state: appState, setContacts, addContact, updateContact, removeContact } = useApp();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para los modales
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [selectedContactName, setSelectedContactName] = useState<string>('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isWishesModalOpen, setIsWishesModalOpen] = useState(false);
  
  // Estados para el diálogo de eliminación
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Estados para las pestañas
  const [activeTab, setActiveTab] = useState(0);
  const [blockedContacts, setBlockedContacts] = useState<Contact[]>([]);
  const [loadingBlocked, setLoadingBlocked] = useState(false);
  const [sentInvitations, setSentInvitations] = useState<Contact[]>([]);
  const [loadingSentInvitations, setLoadingSentInvitations] = useState(false);

  // Cargar contactos al montar el componente
  useEffect(() => {
    loadContacts();
  }, []);

  // Escuchar eventos de invitaciones aceptadas
  useEffect(() => {
    const handleContactInvitationAccepted = (event: CustomEvent) => {
      try {
        console.log('📨 ContactsPage - Evento recibido:', event);
        const { contact } = event.detail;
        console.log('✅ ContactsPage - Invitación aceptada, agregando contacto:', contact);
        console.log('🔍 ContactsPage - Estructura del contacto:', {
          id: contact.id,
          userId: contact.userId,
          contactId: contact.contactId,
          status: contact.status,
          user: contact.user,
          contact: contact.contact
        });
        addContact(contact);
        console.log('✅ ContactsPage - Contacto agregado exitosamente');
      } catch (error) {
        console.error('❌ ContactsPage - Error al procesar evento:', error);
      }
    };

    console.log('🎧 ContactsPage - Registrando listener de eventos');
    window.addEventListener('contactInvitationAccepted', handleContactInvitationAccepted as EventListener);
    
    return () => {
      console.log('🔇 ContactsPage - Removiendo listener de eventos');
      window.removeEventListener('contactInvitationAccepted', handleContactInvitationAccepted as EventListener);
    };
  }, [addContact]);

  // Escuchar cuando se recargan los contactos desde otros componentes
  useEffect(() => {
    // Crear un listener para el evento personalizado
    const handleReloadContacts = () => {
      console.log('🔄 Recargando contactos desde evento personalizado');
      loadContacts();
    };

    // Escuchar el evento personalizado
    window.addEventListener('reloadContacts', handleReloadContacts);

    return () => {
      window.removeEventListener('reloadContacts', handleReloadContacts);
    };
  }, []);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      const contacts = await ContactService.getContactsByBirthday();
      console.log('📋 Todos los contactos cargados:', contacts);
      console.log('📊 Cantidad de contactos:', contacts.length);
      contacts.forEach((contact, index) => {
        console.log(`📝 Contacto ${index + 1}:`, {
          id: contact.id,
          status: contact.status,
          userId: contact.userId,
          contactId: contact.contactId,
          hasContact: !!contact.contact,
          contactName: contact.contact?.nickname,
          hasUser: !!contact.user,
          userName: contact.user?.nickname
        });
      });
      setContacts(contacts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los contactos');
    } finally {
      setIsLoading(false);
    }
  };

  const loadBlockedContacts = async () => {
    try {
      console.log('🔍 Cargando contactos bloqueados...');
      setLoadingBlocked(true);
      const blocked = await ContactService.getBlockedContacts();
      console.log('✅ Contactos bloqueados cargados:', blocked);
      setBlockedContacts(blocked);
    } catch (err) {
      console.error('❌ Error al cargar contactos bloqueados:', err);
      setError('Error al cargar contactos bloqueados');
    } finally {
      setLoadingBlocked(false);
    }
  };

  // Cargar invitaciones enviadas
  const loadSentInvitations = async () => {
    try {
      console.log('🔍 Cargando invitaciones enviadas...');
      setLoadingSentInvitations(true);
      const sent = await ContactService.getSentInvitations();
      console.log('✅ Invitaciones enviadas cargadas:', sent);
      setSentInvitations(sent);
    } catch (err) {
      console.error('❌ Error al cargar invitaciones enviadas:', err);
      setError('Error al cargar invitaciones enviadas');
    } finally {
      setLoadingSentInvitations(false);
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

  // Funciones para manejar los modales
  const handleContactProfileClick = (contactId: string, contactName: string) => {
    setSelectedContactId(contactId);
    setSelectedContactName(contactName);
    setIsProfileModalOpen(true);
  };

  const handleViewWishes = (contactId: string) => {
    setSelectedContactId(contactId);
    setIsWishesModalOpen(true);
  };

  const handleViewContacts = (contactId: string) => {
    // TODO: Implementar vista de contactos del usuario
    console.log('Ver contactos de:', contactId);
  };

  const handleViewMutualFriends = (contactId: string) => {
    // TODO: Implementar vista de amigos en común
    console.log('Ver amigos en común con:', contactId);
  };

  // Manejar clic en eliminar contacto
  const handleDeleteContactClick = (contact: Contact, event: React.MouseEvent) => {
    event.stopPropagation(); // Evitar que se abra el perfil
    setContactToDelete(contact);
    setIsDeleteDialogOpen(true);
  };

  // Eliminar contacto (solo eliminar)
  const handleDeleteContact = async () => {
    if (!contactToDelete) return;
    
    try {
      setIsDeleting(true);
      console.log('🔍 Frontend - Eliminando contacto:', {
        contactId: contactToDelete.id,
        contactUserId: contactToDelete.contactId,
        contactNickname: contactToDelete.contact.nickname
      });
      
      await ContactService.removeContact(contactToDelete.id);
      
      // Actualizar estado local
      removeContact(contactToDelete.id);
      
      // Cerrar diálogo
      setIsDeleteDialogOpen(false);
      setContactToDelete(null);
    } catch (error) {
      console.error('Error al eliminar contacto:', error);
      setError('Error al eliminar contacto');
    } finally {
      setIsDeleting(false);
    }
  };

  // Bloquear y eliminar contacto
  const handleBlockAndDeleteContact = async () => {
    if (!contactToDelete) return;
    
    try {
      setIsDeleting(true);
      await ContactService.blockAndRemoveContact(contactToDelete.id);
      
      // Actualizar estado local
      removeContact(contactToDelete.id);
      
      // Cerrar diálogo
      setIsDeleteDialogOpen(false);
      setContactToDelete(null);
    } catch (error) {
      console.error('Error al bloquear y eliminar contacto:', error);
      setError('Error al bloquear y eliminar contacto');
    } finally {
      setIsDeleting(false);
    }
  };

  // Desbloquear contacto
  const handleUnblockContact = async (contactId: string) => {
    try {
      await ContactService.unblockContact(contactId);
      
      // Recargar contactos bloqueados
      await loadBlockedContacts();
    } catch (error) {
      console.error('Error al desbloquear contacto:', error);
      setError('Error al desbloquear contacto');
    }
  };

  // Manejar cambio de pestaña
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    try {
      console.log('🔄 Cambiando a pestaña:', newValue);
      setActiveTab(newValue);
      if (newValue === 1) {
        // Cargar contactos bloqueados cuando se selecciona la pestaña
        console.log('📋 Cargando pestaña de contactos bloqueados');
        loadBlockedContacts();
      } else if (newValue === 2) {
        // Cargar invitaciones enviadas cuando se selecciona la pestaña
        console.log('📨 Cargando pestaña de invitaciones enviadas');
        loadSentInvitations();
      }
    } catch (error) {
      console.error('❌ Error al cambiar pestaña:', error);
      setError('Error al cambiar de pestaña');
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
          {activeTab === 0 && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setIsAddDialogOpen(true)}
          >
            Agregar Contacto
          </Button>
          )}
        </Box>

        {/* Pestañas */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="contactos tabs">
            <Tab 
              label="Mis Contactos" 
              sx={{ 
                color: colors.text.primary,
                '&.Mui-selected': {
                  color: colors.primary?.[600] || '#0d9488',
                }
              }} 
            />
            <Tab 
              label="Contactos Bloqueados" 
              sx={{ 
                color: colors.text.primary,
                '&.Mui-selected': {
                  color: colors.primary?.[600] || '#0d9488',
                }
              }} 
            />
            <Tab 
              label="Contactos Invitados" 
              sx={{ 
                color: colors.text.primary,
                '&.Mui-selected': {
                  color: colors.primary?.[600] || '#0d9488',
                }
              }} 
            />
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Contenido de la pestaña activa */}
        {activeTab === 0 && (
          // Pestaña de contactos normales
          appState.contacts.length === 0 ? (
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
                .filter(contact => {
                  console.log('🔍 Contacto en filtro:', {
                    id: contact.id,
                    status: contact.status,
                    userId: contact.userId,
                    contactId: contact.contactId,
                    hasContact: !!contact.contact,
                    contactName: contact.contact?.nickname
                  });
                  return contact.status === 'accepted';
                })
              .map((contact) => (
                <Grid item xs={12} sm={6} md={4} key={contact.id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 8px 25px ${colors.shadow.medium}`,
                        },
                      }}
                      onClick={() => handleContactProfileClick(contact.contact.id, contact.contact.nickname)}
                    >
                      {/* Botón de eliminar en la esquina superior derecha */}
                      <IconButton
                        onClick={(e) => handleDeleteContactClick(contact, e)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: colors.background.primary,
                          color: colors.error?.[600] || '#d32f2f',
                          zIndex: 1,
                          '&:hover': {
                            backgroundColor: colors.error?.[50] || '#ffebee',
                          },
                        }}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>

                      <CardContent sx={{ textAlign: 'center', p: 3 }}>
                        <Avatar
                          src={contact.contact.profileImage ? getProfileImageUrl(contact.contact.profileImage) : undefined}
                          sx={{ 
                            width: 80, 
                            height: 80, 
                            mx: 'auto',
                            mb: 2,
                            border: `3px solid ${colors.primary[200]}`,
                            boxShadow: `0 4px 15px ${colors.primary[100]}`,
                          }}
                        >
                          {contact.contact.nickname.charAt(0).toUpperCase()}
                        </Avatar>
                        
                        <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 600, mb: 0.5 }}>
                            {contact.contact.nickname}
                          </Typography>
                        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                            {contact.contact.realName}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          )
        )}

        {activeTab === 1 && (
          // Pestaña de contactos bloqueados
          loadingBlocked ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body2" color="text.secondary">
                Cargando contactos bloqueados...
                          </Typography>
                        </Box>
          ) : blockedContacts.length === 0 ? (
            <Box textAlign="center" py={4}>
              <BlockIcon sx={{ fontSize: 48, color: colors.text.tertiary, mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tienes contactos bloqueados
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Los contactos que bloquees aparecerán aquí
              </Typography>
                      </Box>
          ) : (
            <Grid container spacing={3}>
              {blockedContacts.map((contact) => (
                <Grid item xs={12} sm={6} md={4} key={contact.id}>
                  <Card
                    sx={{
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      opacity: 0.7,
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 25px ${colors.shadow.medium}`,
                        opacity: 1,
                      },
                    }}
                  >
                    {/* Botón de desbloquear en la esquina superior derecha */}
                    <IconButton
                      onClick={() => handleUnblockContact(contact.id)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: colors.background.primary,
                        color: colors.success?.[600] || '#10b981',
                        zIndex: 1,
                        '&:hover': {
                          backgroundColor: colors.success?.[50] || '#ecfdf5',
                        },
                      }}
                      size="small"
                    >
                      <Check fontSize="small" />
                    </IconButton>

                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Avatar
                        src={getProfileImageUrl(contact.contact.profileImage)}
                        sx={{ 
                          width: 80, 
                          height: 80, 
                          mx: 'auto',
                          mb: 2,
                          border: `3px solid ${colors.error?.[200] || '#fecaca'}`,
                          boxShadow: `0 4px 15px ${colors.error?.[100] || '#fee2e2'}`,
                        }}
                      >
                        {contact.contact.nickname.charAt(0).toUpperCase()}
                      </Avatar>
                      
                      <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 600, mb: 0.5 }}>
                        {contact.contact.nickname}
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                        {contact.contact.realName}
                      </Typography>
                      <Chip
                        label="Bloqueado"
                        size="small"
                        color="error"
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )
        )}

        {activeTab === 1 && (
          // Pestaña de contactos bloqueados
          loadingBlocked ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : blockedContacts.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tienes contactos bloqueados
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {blockedContacts.map((contact) => (
                <Grid item xs={12} sm={6} md={4} key={contact.id}>
                  <Card sx={{ position: 'relative' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <Avatar
                          src={contact.contact.profileImage ? getProfileImageUrl(contact.contact.profileImage) : undefined}
                          sx={{
                            width: 80,
                            height: 80,
                            mb: 2,
                            border: `3px solid ${colors.error?.[200] || '#fecaca'}`,
                          }}
                        >
                          {contact.contact.nickname.charAt(0).toUpperCase()}
                        </Avatar>
                        
                        <Typography variant="h6" component="h3" gutterBottom sx={{ color: colors.text.primary, fontWeight: 600 }}>
                          {contact.contact.nickname}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {contact.contact.realName}
                        </Typography>

                        <Chip
                          label="Bloqueado"
                          color="error"
                          size="small"
                          sx={{ mb: 2 }}
                        />
                      
                      <Button
                        variant="outlined"
                        size="small"
                          startIcon={<Check />}
                          onClick={() => handleUnblockContact(contact.id)}
                          sx={{
                            borderColor: colors.success?.[300] || '#86efac',
                            color: colors.success?.[600] || '#16a34a',
                            '&:hover': {
                              borderColor: colors.success?.[400] || '#4ade80',
                              backgroundColor: colors.success?.[50] || '#f0fdf4',
                            },
                          }}
                        >
                          Desbloquear
                      </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )
        )}

        {activeTab === 2 && (
          // Pestaña de contactos invitados
          loadingSentInvitations ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : sentInvitations.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tienes invitaciones pendientes
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Las invitaciones que envíes aparecerán aquí hasta que sean aceptadas
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {sentInvitations.map((contact) => (
                <Grid item xs={12} sm={6} md={4} key={contact.id}>
                  <Card sx={{ position: 'relative' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <Avatar
                          src={contact.contact.profileImage ? getProfileImageUrl(contact.contact.profileImage) : undefined}
                          sx={{
                            width: 80,
                            height: 80,
                            mb: 2,
                            border: `3px solid ${colors.warning?.[200] || '#fed7aa'}`,
                          }}
                        >
                          {contact.contact.nickname.charAt(0).toUpperCase()}
                        </Avatar>
                        
                        <Typography variant="h6" component="h3" gutterBottom sx={{ color: colors.text.primary, fontWeight: 600 }}>
                          {contact.contact.nickname}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {contact.contact.realName}
                        </Typography>

                        <Chip
                          label="Invitación Enviada"
                          color="warning"
                          size="small"
                          sx={{ mb: 2 }}
                        />

                        <Typography variant="caption" color="text.secondary">
                          Enviado: {new Date(contact.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
          )
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

      {/* Modal de perfil de contacto */}
      <ContactProfileModal
        open={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        contactId={selectedContactId}
        onViewWishes={handleViewWishes}
        onViewContacts={handleViewContacts}
        onViewMutualFriends={handleViewMutualFriends}
      />

      {/* Modal de deseos del contacto */}
      <ContactWishesModal
        open={isWishesModalOpen}
        onClose={() => setIsWishesModalOpen(false)}
        contactId={selectedContactId}
        contactName={selectedContactName}
      />

      {/* Diálogo de eliminación de contacto */}
      <DeleteContactDialog
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setContactToDelete(null);
        }}
        onDelete={handleDeleteContact}
        onBlockAndDelete={handleBlockAndDeleteContact}
        contactName={contactToDelete?.contact.nickname || ''}
        loading={isDeleting}
      />
    </Container>
  );
};

export default ContactsPage;
