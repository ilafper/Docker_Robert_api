// telegram.js - EN LA RAÍZ
import axios from 'axios';

export async function enviarMensajeTelegram(mensaje) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    // Modo log si no hay configuración
    if (!token || !chatId) {
        console.log('[LOG] Mensaje para Telegram:', mensaje);
        console.log('Configura TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID en .env');
        return { mode: 'log-only', message: mensaje };
    }
    
    try {
        const response = await axios.post(
            `https://api.telegram.org/bot${token}/sendMessage`,
            
            {
                chat_id: chatId,
                text: mensaje
            }
        );
        console.log('✅ Mensaje enviado a Telegram');
        return response.data;
    } catch (error) {
        console.error('❌ Error Telegram:', error.message);
        throw error;
    }
}