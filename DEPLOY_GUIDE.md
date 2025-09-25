# 🚀 Guía de Deploy - Proyecto Gifiti

## 📋 Resumen del Proyecto

**Gifiti** es una red social para compartir deseos y regalos entre contactos. Consta de:
- **Frontend**: React + Vite + TypeScript + Material-UI
- **Backend**: Node.js + Express + TypeScript + PostgreSQL + Sequelize
- **Base de datos**: PostgreSQL

## 🏗️ Estructura del Proyecto

```
gifiti/
├── red-social/              # Frontend (React)
│   ├── dist/                # Build de producción
│   └── src/
├── red-social-backend/     # Backend (Node.js)
│   ├── dist/               # Build de producción
│   └── src/
└── deploy.sh              # Script de deploy
```

## 🚀 Pasos para Deploy

### 1. **Preparar el Build**

```bash
# Ejecutar el script de deploy
./deploy.sh
```

O manualmente:

```bash
# Build del frontend
cd red-social
npm run build:production

# Build del backend
cd ../red-social-backend
npm run build
```

### 2. **Configurar Base de Datos**

#### Opción A: PostgreSQL en el hosting
- Crear base de datos PostgreSQL
- Configurar usuario y contraseña
- Ejecutar migraciones (Sequelize las crea automáticamente)

#### Opción B: Docker Compose
```bash
cd red-social-backend
docker-compose up -d
```

### 3. **Variables de Entorno**

Crear archivo `.env` en el backend con:

```env
# Base de datos
DB_HOST=tu_host_de_base_de_datos
DB_PORT=5432
DB_NAME=tu_nombre_de_base_de_datos
DB_USER=tu_usuario_de_base_de_datos
DB_PASSWORD=tu_password_de_base_de_datos

# Servidor
PORT=3001
NODE_ENV=production

# Seguridad
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui

# CORS
CORS_ORIGIN=https://tu-dominio.com

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
```

### 4. **Subir Archivos al Hosting**

#### Frontend (Archivos estáticos):
- Subir todo el contenido de `red-social/dist/` a la carpeta web del hosting
- Configurar el servidor web para servir `index.html` en todas las rutas (SPA)

#### Backend (Node.js):
- Subir `red-social-backend/dist/` al servidor
- Subir `red-social-backend/package.json`
- Subir `red-social-backend/ecosystem.config.js` (si usas PM2)
- Subir `red-social-backend/.env`

### 5. **Instalar Dependencias del Backend**

```bash
cd red-social-backend
npm install --production
```

### 6. **Iniciar el Backend**

#### Opción A: PM2 (Recomendado)
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Opción B: Node.js directo
```bash
node dist/index.js
```

#### Opción C: Docker
```bash
docker-compose up -d
```

## 🌐 Configuración del Servidor Web

### Nginx (Recomendado)

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    
    # Frontend (React SPA)
    location / {
        root /path/to/red-social/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Archivos estáticos del backend (uploads)
    location /uploads {
        proxy_pass http://localhost:3001;
    }
}
```

### Apache

```apache
<VirtualHost *:80>
    ServerName tu-dominio.com
    DocumentRoot /path/to/red-social/dist
    
    # Backend API
    ProxyPass /api http://localhost:3001/api
    ProxyPassReverse /api http://localhost:3001/api
    
    # Archivos estáticos
    ProxyPass /uploads http://localhost:3001/uploads
    ProxyPassReverse /uploads http://localhost:3001/uploads
    
    # SPA fallback
    <Directory "/path/to/red-social/dist">
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

## 🔒 SSL/HTTPS

### Let's Encrypt (Gratuito)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

## 📊 Monitoreo

### PM2 Monitoring
```bash
pm2 monit
```

### Logs
```bash
pm2 logs gifiti-backend
```

## 🐛 Troubleshooting

### Backend no inicia
1. Verificar variables de entorno
2. Verificar conexión a base de datos
3. Verificar puerto disponible

### Frontend no carga
1. Verificar que los archivos estén en la ruta correcta
2. Verificar configuración del servidor web
3. Verificar CORS en el backend

### Base de datos
1. Verificar credenciales
2. Verificar que PostgreSQL esté corriendo
3. Verificar que las tablas se crearon automáticamente

## 📞 Soporte

Si tienes problemas con el deploy, verifica:
1. ✅ Variables de entorno configuradas
2. ✅ Base de datos accesible
3. ✅ Puerto 3001 disponible
4. ✅ Archivos de build generados correctamente
5. ✅ Servidor web configurado para SPA

## 🎉 ¡Listo!

Tu aplicación Gifiti debería estar funcionando en `https://tu-dominio.com`

**URLs importantes:**
- Frontend: `https://tu-dominio.com`
- API: `https://tu-dominio.com/api`
- Health Check: `https://tu-dominio.com/api/health`
