import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { syncDatabase } from './models';

// Importar rutas
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import wishRoutes from './routes/wishRoutes';
import contactRoutes from './routes/contactRoutes';
import googleAuthRoutes from './routes/googleAuthRoutes';
import contactNotificationRoutes from './routes/contactNotificationRoutes';
import birthdayNotificationRoutes from './routes/birthdayNotificationRoutes';
import contactProfileRoutes from './routes/contactProfileRoutes';
import notificationRoutes from './routes/notificationRoutes';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de seguridad
// app.use(helmet());

// Middleware de CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Middleware de logging
app.use(morgan('combined'));

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wishes', wishRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/auth/google', googleAuthRoutes);
app.use('/api/contact-notifications', contactNotificationRoutes);
app.use('/api/birthday-notifications', birthdayNotificationRoutes);
app.use('/api/contact-profile', contactProfileRoutes);
app.use('/api/notifications', notificationRoutes);

// Ruta de salud
app.get('/api/health', (req: any, res: any) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta de prueba para verificar archivos estáticos
app.get('/api/test-image', (req: any, res: any) => {
  const fs = require('fs');
  const path = require('path');
  
  const uploadsDir = path.join(process.cwd(), 'uploads', 'wishes');
  const files = fs.readdirSync(uploadsDir);
  
  res.json({
    success: true,
    message: 'Archivos en uploads/wishes',
    files: files.slice(0, 5), // Solo los primeros 5
    uploadsPath: uploadsDir,
    currentDir: process.cwd()
  });
});

// Middleware de manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'El archivo es demasiado grande'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Ruta 404
app.use((req: any, res: any) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Inicializar servidor
const startServer = async () => {
  try {
    // Sincronizar base de datos
    await syncDatabase();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📊 API disponible en http://localhost:${PORT}/api`);
      console.log(`🏥 Health check en http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
