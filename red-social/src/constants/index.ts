// Constantes de la aplicación

export const APP_NAME = 'GiFiTi';
export const APP_DESCRIPTION = 'Red Social de Regalos';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  WISHES: '/wishes',
  CONTACTS: '/contacts',
  EXPLORE: '/explore',
  EXPLORE_USERS: '/explore/users',
  EXPLORE_WISHES: '/explore/wishes',
} as const;

export const NAVIGATION_TABS = {
  PROFILE: 'profile',
  WISHES: 'wishes',
  CONTACTS: 'contacts',
  EXPLORE: 'explore',
} as const;

export const EXPLORE_TYPES = {
  USERS: 'users',
  WISHES: 'wishes',
} as const;

export const CONTACT_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
} as const;

export const NOTIFICATION_TYPES = {
  WISH_RESERVED: 'wish_reserved',
  WISH_GIFTED: 'wish_gifted',
  CONTACT_REQUEST: 'contact_request',
  CONTACT_ACCEPTED: 'contact_accepted',
} as const;

export const GIFT_STATUS = {
  RESERVED: 'reserved',
  GIFTED: 'gifted',
  DELIVERED: 'delivered',
} as const;

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NICKNAME_MIN_LENGTH: 3,
  NICKNAME_MAX_LENGTH: 30,
  REAL_NAME_MIN_LENGTH: 2,
  REAL_NAME_MAX_LENGTH: 50,
  WISH_DESCRIPTION_MAX_LENGTH: 500,
  WISH_TITLE_MAX_LENGTH: 100,
  MAX_WISHES_PER_USER: 10,
} as const;

export const FILE_UPLOAD = {
  MAX_IMAGE_SIZE: 20 * 1024 * 1024, // 20MB (más generoso)
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
  PROFILE_IMAGE_DIMENSIONS: { width: 300, height: 300 },
  WISH_IMAGE_DIMENSIONS: { width: 400, height: 400 },
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu internet.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  FORBIDDEN: 'Acceso denegado.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  SERVER_ERROR: 'Error interno del servidor. Inténtalo más tarde.',
  VALIDATION_ERROR: 'Por favor, verifica los datos ingresados.',
  INVALID_CREDENTIALS: 'Email o contraseña incorrectos.',
  EMAIL_ALREADY_EXISTS: 'Este email ya está registrado.',
  NICKNAME_ALREADY_EXISTS: 'Este nickname ya está en uso.',
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '¡Bienvenido!',
  REGISTER_SUCCESS: '¡Registro exitoso! Ya puedes iniciar sesión.',
  PROFILE_UPDATED: 'Perfil actualizado correctamente.',
  WISH_ADDED: 'Deseo agregado a tu lista.',
  WISH_UPDATED: 'Deseo actualizado correctamente.',
  WISH_DELETED: 'Deseo eliminado de tu lista.',
  CONTACT_ADDED: 'Solicitud de contacto enviada.',
  CONTACT_ACCEPTED: 'Contacto aceptado.',
  GIFT_RESERVED: 'Regalo reservado exitosamente.',
  GIFT_GIVEN: '¡Regalo entregado!',
} as const;
