# Imagen base
FROM node:20

# Directorio de trabajo en el contenedor
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Puerto que expondrá el contenedor
EXPOSE 3000

# Comando para ejecutar la app
CMD ["node", "server.js"]
