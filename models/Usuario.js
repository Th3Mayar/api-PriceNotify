import mongoose from "mongoose";

const usuarioSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: false,
  },
  apellido: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    required: false,
    trim: true
  },
  phone: {
    type: String,
    required: false,
    trim: true
  },
  address: {
    type: String,
    required: false,
    trim: true
  },
  creado: {
    type: Date,
    default: Date.now(),
  },
  productos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Producto"
  }]
});

export default mongoose.model("Usuario", usuarioSchema);
