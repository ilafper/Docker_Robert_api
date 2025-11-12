FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Puerto que expondrá el contenedor
EXPOSE 3000

# Comando para ejecutar la app
CMD ["node", "server.js"]