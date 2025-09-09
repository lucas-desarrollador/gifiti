# Red Social de Regalos

Una plataforma web desarrollada con React y TypeScript que permite a los usuarios gestionar sus deseos de regalos y conectarse con otros usuarios para celebrar cumpleaños.

## 🚀 Características Principales

- **Autenticación segura** con JWT tokens
- **Gestión de perfil** con foto, datos personales y fecha de nacimiento
- **Top 10 deseos** con imágenes, descripciones y enlaces de compra
- **Sistema de contactos** ordenados por proximidad de cumpleaños
- **Exploración** de usuarios y deseos
- **Reserva de regalos** para evitar duplicados
- **Sistema de votaciones** para evaluar regalos recibidos

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Material-UI (MUI)
- **Routing**: React Router DOM
- **State Management**: Context API + useReducer
- **Forms**: React Hook Form + Yup
- **HTTP Client**: Axios
- **Styling**: Emotion (MUI)

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Layout/         # Componentes de layout
│   └── Wishes/         # Componentes específicos de deseos
├── pages/              # Páginas principales
├── services/           # Servicios de API
├── hooks/              # Custom hooks
├── context/            # Context providers
├── types/              # Definiciones TypeScript
├── utils/              # Utilidades
├── constants/          # Constantes
└── assets/             # Imágenes, iconos, etc.
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd red-social
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env en la raíz del proyecto
   VITE_API_BASE_URL=http://localhost:3001/api
   VITE_APP_NAME=Red Social de Regalos
   VITE_APP_VERSION=1.0.0
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

## 📋 Scripts Disponibles

- `npm run dev` - Ejecuta la aplicación en modo desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## 🏗️ Arquitectura

### Módulos Principales

1. **Auth Module** - Autenticación y registro de usuarios
2. **Profile Module** - Gestión de perfil de usuario
3. **Wishes Module** - Top 10 deseos de regalos
4. **Contacts Module** - Gestión de contactos
5. **Explore Module** - Exploración de usuarios/deseos
6. **Notifications Module** - Sistema de notificaciones
7. **Gift Management Module** - Reserva y gestión de regalos

### Estado Global

La aplicación utiliza Context API con useReducer para manejar el estado global:

- **AuthContext**: Maneja autenticación y datos del usuario
- **AppContext**: Maneja datos de la aplicación (deseos, contactos, notificaciones)

### Servicios de API

Cada módulo tiene su propio servicio para manejar las peticiones HTTP:

- `AuthService` - Autenticación
- `UserService` - Gestión de usuarios
- `WishService` - Gestión de deseos
- `ContactService` - Gestión de contactos

## 🔧 Configuración del Backend

Esta aplicación frontend está diseñada para trabajar con un backend REST API. Asegúrate de que tu backend tenga los siguientes endpoints:

### Autenticación
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Usuarios
- `GET /api/users/profile`
- `PUT /api/users/profile`
- `GET /api/users/:id`

### Deseos
- `GET /api/wishes`
- `POST /api/wishes`
- `PUT /api/wishes/:id`
- `DELETE /api/wishes/:id`

### Contactos
- `GET /api/contacts`
- `POST /api/contacts/request`
- `PUT /api/contacts/:id/accept`

## 🎨 Personalización

### Temas

El tema de Material-UI puede ser personalizado en `src/App.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});
```

### Constantes

Las constantes de la aplicación están en `src/constants/index.ts` y pueden ser modificadas según las necesidades.

## 🚀 Despliegue

### Build para Producción

```bash
npm run build
```

Los archivos estáticos se generarán en la carpeta `dist/`.

### Variables de Entorno para Producción

Asegúrate de configurar las variables de entorno correctas para tu entorno de producción:

```bash
VITE_API_BASE_URL=https://tu-api.com/api
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes preguntas o necesitas ayuda, por favor abre un issue en el repositorio.

---

**Nota**: Este es un proyecto frontend. Asegúrate de tener un backend funcionando con los endpoints necesarios para que la aplicación funcione correctamente.