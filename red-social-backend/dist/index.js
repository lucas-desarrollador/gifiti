"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const models_1 = require("./models");
// Importar rutas
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const wishRoutes_1 = __importDefault(require("./routes/wishRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const googleAuthRoutes_1 = __importDefault(require("./routes/googleAuthRoutes"));
const contactNotificationRoutes_1 = __importDefault(require("./routes/contactNotificationRoutes"));
const birthdayNotificationRoutes_1 = __importDefault(require("./routes/birthdayNotificationRoutes"));
const contactProfileRoutes_1 = __importDefault(require("./routes/contactProfileRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const privacyRoutes_1 = __importDefault(require("./routes/privacyRoutes"));
// Cargar variables de entorno
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware de seguridad
// app.use(helmet());
// Middleware de CORS
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
// Middleware de logging
app.use((0, morgan_1.default)('combined'));
// Middleware para parsear JSON
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// Rutas de la API
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/wishes', wishRoutes_1.default);
app.use('/api/contacts', contactRoutes_1.default);
app.use('/api/auth/google', googleAuthRoutes_1.default);
app.use('/api/contact-notifications', contactNotificationRoutes_1.default);
app.use('/api/birthday-notifications', birthdayNotificationRoutes_1.default);
app.use('/api/contact-profile', contactProfileRoutes_1.default);
app.use('/api/notifications', notificationRoutes_1.default);
app.use('/api/privacy', privacyRoutes_1.default);
// Ruta de salud
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});
// Ruta de prueba para verificar archivos estáticos
app.get('/api/test-image', (req, res) => {
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
app.use((err, req, res, next) => {
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
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});
// Inicializar servidor
const startServer = async () => {
    try {
        // Sincronizar base de datos
        await (0, models_1.syncDatabase)();
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
            console.log(`📊 API disponible en http://localhost:${PORT}/api`);
            console.log(`🏥 Health check en http://localhost:${PORT}/api/health`);
        });
    }
    catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map