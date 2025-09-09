import { createTheme } from '@mui/material/styles';
import { colors, gradients } from './colors';

// Tema profesional inspirado en Filmora con fondo matizado
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary[500], // Verde agua principal
      light: colors.primary[300],
      dark: colors.primary[700],
      contrastText: colors.text.inverse,
    },
    secondary: {
      main: colors.primary[600],
      light: colors.primary[400],
      dark: colors.primary[800],
      contrastText: colors.text.inverse,
    },
    background: {
      default: colors.background.primary, // Fondo matizado como WhatsApp
      paper: colors.background.card,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
    grey: {
      50: colors.background.primary,
      100: colors.background.secondary,
      200: colors.border.light,
      300: colors.border.medium,
      400: colors.border.dark,
      500: colors.text.tertiary,
      600: colors.text.secondary,
      700: colors.text.primary,
      800: colors.text.primary,
      900: colors.text.primary,
    },
    success: {
      main: colors.status.success,
    },
    warning: {
      main: colors.status.warning,
    },
    error: {
      main: colors.status.error,
    },
    info: {
      main: colors.status.info,
    },
  },
  
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      color: colors.text.primary,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: colors.text.primary,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: colors.text.primary,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: colors.text.primary,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: colors.text.primary,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: colors.text.primary,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      color: colors.text.primary,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: colors.text.secondary,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      color: colors.text.tertiary,
    },
  },

  shape: {
    borderRadius: 12, // Bordes más redondeados para look moderno
  },

  shadows: [
    'none',
    colors.shadow.sm,
    colors.shadow.md,
    colors.shadow.lg,
    colors.shadow.xl,
    colors.shadow.xl,
    colors.shadow.xl,
    colors.shadow.xl,
    colors.shadow.xl,
    colors.shadow.xl,
    colors.shadow.xl,
    colors.shadow.xl,
    colors.shadow.xl,
    colors.shadow.xl,
    colors.shadow.xl,
    colors.shadow.xl,
    colors.shadow.xl,
    colors.shadow.xl,
    colors.shadow.xl,
    colors.shadow.xl,
    colors.shadow.xl,
    colors.shadow.xl,
    colors.shadow.xl,
    colors.shadow.xl,
    colors.shadow.xl,
  ],

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.background.primary,
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: colors.shadow.md,
          },
        },
        contained: {
          background: gradients.primary,
          '&:hover': {
            background: colors.primary[600],
          },
        },
        outlined: {
          borderColor: colors.primary[300],
          color: colors.primary[500],
          '&:hover': {
            borderColor: colors.primary[500],
            backgroundColor: colors.primary[50],
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: colors.shadow.md,
          border: `1px solid ${colors.border.light}`,
          background: colors.background.card,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: gradients.primary,
          boxShadow: colors.shadow.md,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.card,
          borderRadius: 12,
          padding: 4,
        },
        indicator: {
          backgroundColor: colors.primary[500],
          height: 3,
          borderRadius: 2,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          color: colors.text.secondary,
          '&.Mui-selected': {
            color: colors.primary[500],
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: colors.background.card,
            '& fieldset': {
              borderColor: colors.border.light,
            },
            '&:hover fieldset': {
              borderColor: colors.primary[300],
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary[500],
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: colors.primary[50],
          color: colors.primary[700],
          border: `1px solid ${colors.primary[200]}`,
        },
      },
    },
  },
});

// Exportar colores y gradientes para uso directo
export { colors, gradients };
