#!/bin/bash

# Script de deploy para Gifiti
echo "🚀 Iniciando deploy de Gifiti..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

print_status "📦 Construyendo frontend..."
cd red-social
npm run build:production
if [ $? -ne 0 ]; then
    print_error "Error al construir el frontend"
    exit 1
fi

print_status "🔧 Construyendo backend..."
cd ../red-social-backend
npm run build
if [ $? -ne 0 ]; then
    print_error "Error al construir el backend"
    exit 1
fi

print_status "✅ Build completado exitosamente!"
print_status "📁 Archivos listos para deploy:"
print_status "   - Frontend: red-social/dist/"
print_status "   - Backend: red-social-backend/dist/"

print_warning "⚠️  Recuerda configurar las variables de entorno en tu hosting:"
print_warning "   - DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD"
print_warning "   - JWT_SECRET"
print_warning "   - CORS_ORIGIN"
print_warning "   - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET (si usas Google Auth)"

echo ""
print_status "🎉 ¡Deploy listo! Sube los archivos a tu hosting."
