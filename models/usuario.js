import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true, },
  nota: { type: String, required: false },
},{
  versionKey: false
});



const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
