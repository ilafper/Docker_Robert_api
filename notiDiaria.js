// notificador-diario.js - VERSIÓN SIMPLE Y FUNCIONAL
import dotenv from 'dotenv';
import { enviarMensajeTelegram } from './telegram.js';

// Cargar variables de entorno
dotenv.config();

async function enviarNotificacionDiaria() {
    console.log(`⏰ ${new Date().toLocaleTimeString()} - Preparando notificación...`);
    
    // Formatear fecha en español
    const fecha = new Date().toLocaleString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Mensaje de notificación
    const mensaje = `🕗 NOTIFICACIÓN DIARIA 21:20\n\n` +
                   `📅 ${fecha}\n` +
                   `✅ Sistema funcionando correctamente\n\n` +
                   `⚡ Enviado automáticamente`;
    
    console.log('📤 Enviando a Telegram...');
    
    try {
        const resultado = await enviarMensajeTelegram(mensaje);
        console.log('✅ Notificación enviada exitosamente');
        console.log('📨 Mensaje ID:', resultado?.result?.message_id || 'N/A');
        return resultado;
    } catch (error) {
        console.error('❌ Error enviando notificación:', error.message);
        throw error;
    }
}

// Función que verifica si es la hora 21:20
function verificarHora() {
    const ahora = new Date();
    const hora = ahora.getHours();
    const minutos = ahora.getMinutes();
    
    // Si son las 21:20 exactas
    if (hora === 21 && minutos === 20) {
        console.log('\n🎯 ¡HORA EXACTA DETECTADA! 21:20');
        console.log('🚀 Ejecutando notificación diaria...');
        enviarNotificacionDiaria();
    }
}

// INICIAR EL SISTEMA
console.log('='.repeat(50));
console.log('⏰ NOTIFICADOR DIARIO INICIADO');
console.log('📅 Se ejecutará automáticamente TODOS los días a las 21:20');
console.log('🔄 Verificando hora cada minuto...');
console.log('='.repeat(50));
console.log(`⏱️  Hora actual: ${new Date().toLocaleTimeString()}`);
console.log(`📁 Directorio: ${process.cwd()}`);
console.log('='.repeat(50));

// Verificar cada minuto (10000 ms = 1 minuto)
setInterval(verificarHora, 10000);

// Verificar ahora también (por si acaso)
verificarHora();

// Mantener el proceso vivo
process.on('SIGINT', () => {
    console.log('\n👋 Notificador detenido');
    process.exit(0);
});