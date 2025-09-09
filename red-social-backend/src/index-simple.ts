import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware básico
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend funcionando',
    data: { test: 'ok' }
  });
});

// Ruta de registro simple
app.post('/api/auth/register', (req, res) => {
  const { email, password, nickname, realName, birthDate } = req.body;
  
  // Validación básica
  if (!email || !password || !nickname || !realName || !birthDate) {
    return res.status(400).json({
      success: false,
      message: 'Todos los campos son requeridos'
    });
  }

  // Simular registro exitoso
  res.status(201).json({
    success: true,
    data: {
      user: {
        id: '1',
        email,
        nickname,
        realName,
        birthDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      token: 'fake-jwt-token-for-testing'
    },
    message: 'Usuario registrado exitosamente'
  });
});

// Ruta de login simple
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email y contraseña son requeridos'
    });
  }

  // Simular login exitoso
  res.json({
    success: true,
    data: {
      user: {
        id: '1',
        email,
        nickname: 'testuser',
        realName: 'Usuario Test',
        birthDate: '1990-01-01',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      token: 'fake-jwt-token-for-testing'
    },
    message: 'Login exitoso'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📊 API disponible en http://localhost:${PORT}/api`);
  console.log(`🏥 Health check en http://localhost:${PORT}/api/health`);
});
