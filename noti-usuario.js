// notificar-usuario.js
import { inngest } from './ingest-cliente.js';
import { enviarMensajeTelegram } from './telegram.js';

export const notificarUsuarioCreado = inngest.createFunction(
    {
        id: 'notificar-usuario-creado',
        name: 'Notificar nuevo usuario',
        retries: 3 
    },
    { event: 'usuario.creado' },
    async ({ event }) => {
        const { nombre, apellidos, nota } = event.data;

        const mensaje = `🎉 NUEVO USUARIO (vía Inngest)\n\n` +
            `👤 ${nombre} ${apellidos}\n` +
            `📝 ${nota}\n` +
            `⏰ ${new Date().toLocaleTimeString('es-ES')}`;

        console.log('📤 Enviando notificación vía Inngest...');
        
        await enviarMensajeTelegram(mensaje);

        return { success: true, usuarioId: event.data.usuarioId, notificado: true };
    }
);