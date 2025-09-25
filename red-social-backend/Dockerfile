# Dockerfile para producción
FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código compilado
COPY dist/ ./dist/
COPY uploads/ ./uploads/

# Crear directorio de logs
RUN mkdir -p logs

# Exponer puerto
EXPOSE 3001

# Comando para iniciar la aplicación
CMD ["node", "dist/index.js"]
