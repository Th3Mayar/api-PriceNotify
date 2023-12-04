import mongoose from "mongoose";

const productoSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: false,
      trim: true,
    },
    precio: {
      type: Number,
      required: true,
    },
    precioStop: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      require: true,
      trim: true,
    },
    images: [{
      type: String
    }]
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Producto", productoSchema);
