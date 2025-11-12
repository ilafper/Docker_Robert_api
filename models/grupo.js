import mongoose from "mongoose";

const grupoSchema = new mongoose.Schema({
  nombreGrupo: { type: String, required: true },
  cantidadAlumnos: { type: Number, required: true},
},{
  versionKey: false
});

const Grupo = mongoose.model("Grupo", grupoSchema);

export default Grupo;