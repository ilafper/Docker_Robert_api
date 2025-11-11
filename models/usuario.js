import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  edad: { type: Number }
},{
  versionKey: false
});


// Esto crea la colección "usuarios" (Mongoose pone el nombre en plural)
const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
