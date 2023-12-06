import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
      },
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Producto",
    },
    notification: {
      type: String,
      required: false,
      trim: true,
    },
    precio: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Notification", notificationSchema);
