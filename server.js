import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import { serve } from 'inngest/express';
import { inngest } from './ingest-cliente.js';
import { enviarMensajeTelegram } from './telegram.js'; // ← AÑADIR ESTO
import Usuario from "./models/usuario.js";
import Grupo from "./models/grupo.js";

// Cargar variables de entorno
dotenv.config();

const app = express();
app.use(express.json());

async function iniciarServidor() {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/miBaseDeDatos";

    try {
        await mongoose.connect(uri);
        console.log("✅ Mongoose conectado a MongoDB");

        // --- Crear datos de ejemplo ---
        const usuariosExistentes = await Usuario.countDocuments();
        if (usuariosExistentes === 0) {
            await Usuario.insertMany([
                { nombre: "Ana", email: "ana7@email.com", edad: 25 },
                { nombre: "Luis", email: "luis@email.com", edad: 30 }
            ]);
            console.log("✅ Usuarios de ejemplo creados");
        }

        const gruposExistentes = await Grupo.countDocuments();
        if (gruposExistentes === 0) {
            await Grupo.insertMany([
                { nombreGrupo: "Grupo A", cantidadAlumnos: 10 },
                { nombreGrupo: "Grupo B", cantidadAlumnos: 15 }
            ]);
            console.log("✅ Grupos de ejemplo creados");
        }

        app.get("/", async (req, res) => {
            res.json({message:'API Robert funcionando'});
        });

        // Registrar endpoint de Inngest (si lo usas para algo más)
        // app.use('/api/inngest', serve({
        //     client: inngest,
        //     functions: [], // Vacío por ahora
        // }));

        // --- Endpoints GET ---
        app.get("/usuarios", async (req, res) => {
            const usuarios = await Usuario.find();
            res.json(usuarios);
        });

        app.get("/grupos", async (req, res) => {
            const grupos = await Grupo.find();
            res.json(grupos);
        });

        // --- Crear usuarios  ---
        app.post("/crearusuario", async (req, res) => {
            try {
                const { nombre,apellidos,edad } = req.body;
                
                const nuevoUsuario = new Usuario({
                    nombre,
                    apellidos,
                    edad
                });
                
                
                // NOTIFICACIÓN A TELEGRAM
                const totalUsuarios = await Usuario.countDocuments();
                
                const mensaje = `USUARIO NUEVO YEY YEY YUPI YUPI \n\n` +
                               `👤 Nombre: ${nombre || 'No especificado'}\n` +
                               `� Apellidos: ${apellidos || 'No especificado'}\n` +
                               `📊 Total usuarios: ${totalUsuarios}\n` +
                               `🕐 ${new Date().toLocaleTimeString('es-ES')}\n` +
                               `📅 ${new Date().toLocaleDateString('es-ES')}`;
                
                // Enviar en segundo plano (no bloquea la respuesta)
                enviarMensajeTelegram(mensaje)
                    .then(() => console.log(`📨 Telegram: Usuario "${nombre}" registrado`))
                    .catch(error => {
                        console.log('⚠️  Telegram offline:', error.message);
                        console.log('   (Usuario igual fue guardado en la base de datos)');
                    });
                
                res.status(201).json({
                    success: true,
                    message: "Usuario creado exitosamente",
                    usuario: savedUsuario,
                    totalUsuarios,
                    notificacion: "Enviada a Telegram"
                });
                
            } catch (error) {
                console.error("❌ Error creando usuario:", error.message);
                
                // Notificar error también (opcional)
                enviarMensajeTelegram(`❌ ERROR: ${error.message}`)
                    .catch(() => {}); // Ignorar si también falla
                
                res.status(400).json({ 
                    success: false, 
                    error: error.message 
                });
            }
        });

        app.post("/creargrupos", async (req, res) => {
            try {
                const nuevoGrupo = new Grupo(req.body);
                const savedGrupo = await nuevoGrupo.save();
                res.status(201).json(savedGrupo);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        });

        // --- Endpoints PUT (editar) ---
        app.put("/actuusuarios/:id", async (req, res) => {
            try {
                const usuarioActualizado = await Usuario.findByIdAndUpdate(
                    req.params.id,
                    req.body,
                    { new: true }
                );
                if (!usuarioActualizado) return res.status(404).json({ error: "Usuario no encontrado" });
                res.json(usuarioActualizado);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        });

        app.put("/actugrupos/:id", async (req, res) => {
            try {
                const grupoActualizado = await Grupo.findByIdAndUpdate(
                    req.params.id,
                    req.body,
                    { new: true }
                );
                if (!grupoActualizado) return res.status(404).json({ error: "Grupo no encontrado" });
                res.json(grupoActualizado);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        });

        // --- endpoint delete ---
        app.delete("/deleteusuarios/:id", async (req, res) => {
            try {
                const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
                if (!usuarioEliminado) return res.status(404).json({ error: "Usuario no encontrado" });
                res.json({ mensaje: "Usuario eliminado correctamente" });
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        });

        app.delete("/deletegrupos/:id", async (req, res) => {
            try {
                const grupoEliminado = await Grupo.findByIdAndDelete(req.params.id);
                
                if (!grupoEliminado) return res.status(404).json({ error: "Grupo no encontrado" });
                res.json({ mensaje: "Grupo eliminado correctamente" });
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        });

        const PORT = 3000;
        
        app.listen(PORT, () => {
            console.log('='.repeat(50));
            console.log(`🚀 Servidor API: http://localhost:${PORT}`);
            console.log(`💾 MongoDB: Conectado`);
            console.log(`🚀 Servidor INGEST: http://localhost:8288`);
        });

    } catch (error) {
        console.error("❌ Error al conectar a MongoDB:", error);
    }
}

iniciarServidor();