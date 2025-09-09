// Sistema de colores profesional para la red social
// Inspirado en Filmora con fondo matizado como WhatsApp

export const colors = {
  // Color principal - Verde agua distintivo
  primary: {
    50: '#f0fdfa',
    100: '#ccfbf1', 
    200: '#99f6e4',
    300: '#5eead4',  // Verde agua principal
    400: '#2dd4bf',
    500: '#14b8a6',  // Verde agua base
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },

  // Fondo matizado - Gris claro sutil como WhatsApp
  background: {
    primary: '#f8fafc',    // Fondo principal - gris muy claro
    secondary: '#f1f5f9',  // Fondo secundario
    tertiary: '#e2e8f0',   // Fondo terciario
    card: '#ffffff',       // Fondo de tarjetas
    overlay: 'rgba(0, 0, 0, 0.1)', // Overlay sutil
  },

  // Tema oscuro para ventanas principales
  dark: {
    primary: '#1e293b',    // Fondo principal oscuro
    secondary: '#334155',  // Fondo secundario oscuro
    tertiary: '#475569',   // Fondo terciario oscuro
    card: '#0f172a',       // Fondo de tarjetas oscuro
    surface: '#1e293b',    // Superficie oscura
    overlay: 'rgba(0, 0, 0, 0.3)', // Overlay oscuro
  },

  // Texto - Contraste profesional
  text: {
    primary: '#1e293b',    // Texto principal - gris oscuro
    secondary: '#475569',  // Texto secundario
    tertiary: '#64748b',   // Texto terciario
    inverse: '#ffffff',    // Texto sobre fondos oscuros
    muted: '#94a3b8',      // Texto deshabilitado
  },

  // Texto para tema oscuro
  textDark: {
    primary: '#f8fafc',    // Texto principal en tema oscuro
    secondary: '#cbd5e1',  // Texto secundario en tema oscuro
    tertiary: '#94a3b8',   // Texto terciario en tema oscuro
    inverse: '#1e293b',    // Texto sobre fondos claros
    muted: '#64748b',      // Texto deshabilitado en tema oscuro
  },

  // Estados y feedback
  status: {
    success: '#10b981',    // Verde éxito
    warning: '#f59e0b',    // Amarillo advertencia
    error: '#ef4444',      // Rojo error
    info: '#3b82f6',       // Azul información
  },

  // Bordes y separadores
  border: {
    light: '#e2e8f0',      // Bordes claros
    medium: '#cbd5e1',     // Bordes medios
    dark: '#94a3b8',       // Bordes oscuros
  },

  // Sombras sutiles
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
} as const;

// Gradientes profesionales
export const gradients = {
  primary: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
  subtle: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  card: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
} as const;
