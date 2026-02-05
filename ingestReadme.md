# 📱 ROBERT API — Resumen de Configuración

## 🎯 Descripción

Esta API permite:

- Guardar usuarios en **MongoDB**
- Enviar notificaciones automáticas a **Telegram**
- Funcionar localmente en: `http://localhost:3000`
- Reintentar el envío si Telegram falla

---

## ⚙️ Variables de Entorno (`.env`)

Crear un archivo `.env` en la raíz del proyecto con:

- `TELEGRAM_BOT_TOKEN` → Token del bot de Telegram  
- `TELEGRAM_CHAT_ID` → ID del chat donde llegarán las notificaciones  
- `MONGO_URI` → URL de conexión a MongoDB

Ejemplo:

- TELEGRAM_BOT_TOKEN=tu_token  
- TELEGRAM_CHAT_ID=tu_chat_id  
- MONGO_URI=mongodb://localhost:27017/miBaseDeDatos  

---

## 🤖 Configurar Telegram

### 1. Obtener Token del Bot

1. Buscar en Telegram: **@BotFather**
2. Enviar el comando:


3. Seguir las instrucciones
4. Copiar el token generado

---

### 2. Obtener tu Chat ID

1. Buscar: **@userinfobot**
2. Enviar cualquier mensaje
3. Copiar el número que te devuelve (Chat ID)

---

## 📦 Instalar Dependencias

Ejecutar:

```bash
npm install express mongoose axios inngest dotenv
