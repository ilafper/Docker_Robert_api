import mongoose from "mongoose";

const grupoSchema = new mongoose.Schema({
  nombreGrupo: { type: String, required: true },
  cantidadAlumnos: { type: Number, required: true},
},{
  versionKey: false
});


// Esto crea la colección "usuarios" (Mongoose pone el nombre en plural)
const Grupo = mongoose.model("Grupo", grupoSchema);

export default Grupo;