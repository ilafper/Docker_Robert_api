import express from "express";
import mongoose from "mongoose";
import Usuario from "./models/usuario.js";
import Grupo from "./models/grupo.js";

const app = express();
app.use(express.json());

async function iniciarServidor() {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/miBaseDeDatos";

    try {
        await mongoose.connect(uri);
        console.log("Mongoose conectado a MongoDB local");

        // --- Crear datos de ejemplo ---
        const usuariosExistentes = await Usuario.countDocuments();
        if (usuariosExistentes === 0) {
            await Usuario.insertMany([
                { nombre: "Ana", email: "ana@email.com", edad: 25 },
                { nombre: "Luis", email: "luis@email.com", edad: 30 }
            ]);
            console.log("Usuarios de ejemplo creados");
        }

        const gruposExistentes = await Grupo.countDocuments();
        if (gruposExistentes === 0) {
            await Grupo.insertMany([
                { nombreGrupo: "Grupo A", cantidadAlumnos: 10 },
                { nombreGrupo: "Grupo B", cantidadAlumnos: 15 }
            ]);
            console.log("Grupos de ejemplo creados");
        }

        // --- Endpoints GET ---
        app.get("/usuarios", async (req, res) => {
            const usuarios = await Usuario.find();
            res.json(usuarios);
        });

        app.get("/grupos", async (req, res) => {
            const grupos = await Grupo.find();
            res.json(grupos);
        });

        // --- Endpoints POST (crear) ---
        app.post("/usuarios", async (req, res) => {
            try {
                const nuevoUsuario = new Usuario(req.body);
                const savedUsuario = await nuevoUsuario.save();
                res.status(201).json(savedUsuario);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        });

        app.post("/grupos", async (req, res) => {
            try {
                const nuevoGrupo = new Grupo(req.body);
                const savedGrupo = await nuevoGrupo.save();
                res.status(201).json(savedGrupo);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        });

        // --- Endpoints PUT (editar) ---
        app.put("/usuarios/:id", async (req, res) => {
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

        app.put("/grupos/:id", async (req, res) => {
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

        // --- Endpoints DELETE (eliminar) ---
        app.delete("/usuarios/:id", async (req, res) => {
            try {
                const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
                if (!usuarioEliminado) return res.status(404).json({ error: "Usuario no encontrado" });
                res.json({ mensaje: "Usuario eliminado correctamente" });
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        });

        app.delete("/grupos/:id", async (req, res) => {
            try {
                const grupoEliminado = await Grupo.findByIdAndDelete(req.params.id);
                if (!grupoEliminado) return res.status(404).json({ error: "Grupo no encontrado" });
                res.json({ mensaje: "Grupo eliminado correctamente" });
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        });

        const PORT = 3000;
        app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));

    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
    }
}

iniciarServidor();
