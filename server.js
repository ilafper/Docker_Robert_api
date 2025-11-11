import express from "express";
import mongoose from "mongoose";
import Usuario from "./models/usuario.js";
import Grupo from "./models/grupo.js";

const app = express();
app.use(express.json());

async function iniciarServidor() {

    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/miBaseDeDatos";

    try {
        // Conectar Mongoose
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Mongoose conectado a MongoDB local");

        // --- Crear datos de ejemplo si no existen ---
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

        const PORT = 3000;
        app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));

    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
    }
}

// Ejecutar servidor
iniciarServidor();
