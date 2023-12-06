import Usuario from "../models/Usuario.js";
import Producto from "../models/Producto.js";
import Notification from "../models/Notification.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendEmail from "../helper/email.js";

dotenv.config({ path: "variables.env" });

const crearToken = (usuario, secreta, expiresIn) => {
  console.log(usuario);
  const { id, email, nombre, apellido } = usuario;
  return jwt.sign({ id, email, nombre, apellido }, secreta, { expiresIn });
};

// Resolvers
const resolvers = {
  Query: {
    obtenerUsuario: async (_, { token }) => {
      const usuarioToken = await jwt.verify(token, process.env.SECRETA);
      console.log(usuarioToken);
      if (!usuarioToken) throw new Error("No se pudo autenticar el token");
      try {
        const usuarioDB = await Usuario.findById(usuarioToken.id).populate({
          path: "productos",
        });
        if (!usuarioDB) throw new Error("El usuario no existe");

        return usuarioDB;
      } catch (error) {
        console.log("Error en la consulta del usuario");
        console.log(error);
        throw error;
      }
    },
    obtenerProductos: async () => {
      try {
        const productos = await Producto.find({});
        return productos;
      } catch (error) {
        console.log(error);
      }
    },
    obtenerProducto: async (_, { id }) => {
      // Revisar si el producto existe
      const producto = await Producto.findById(id);
      if (!producto) {
        throw new Error("El producto no existe");
      }
      return producto;
    },
    obtenerUsuariosConProductos: async () => {
      try {
        console.log("Obteniendo usuario x productos")
        const usuariosConProductos = await Usuario.find().populate("productos");

        return usuariosConProductos;
      } catch (error) {
        console.log("Error al obtener usuarios con productos:", error);
        throw new Error("No se pudieron obtener los usuarios con productos");
      }
    },
    obtenerNotificaciones: async (_, { }, {usuario}) => {
      try {
        const notificaciones = await Notification.find({usuario: usuario.id}).populate('producto usuario');
        return notificaciones;
      } catch (error) {
        console.log(error);
      }
    },
  },
  Mutation: {
    nuevoUsuario: async (_, { input }) => {
      const { email, password } = input;

      // Revisar si el user anda registrado
      const existeUsuario = await Usuario.findOne({ email });
      console.log(existeUsuario);
      if (existeUsuario) throw new Error("El correo ya esta en uso.");

      // Encriptar o Hashear la pass
      const salt = await bcryptjs.genSalt(10);
      input.password = await bcryptjs.hash(password, salt);

      try {
        // Guardar el user en la db
        const usuario = new Usuario(input);
        usuario.save();
        sendEmail({
          to: usuario.email,
          subject: "Registro Completado",
          html: `<h3><span style="color:blue;">${usuario.nombre} ${usuario.apellido}</span> Se ha registrado con exito en PriceNotify</h3>`,
        });
        return usuario;
      } catch (error) {
        console.log(error);
      }
    },
    autenticarUsuario: async (_, { input }) => {
      const { email, password } = input;
      // Si el usuario no existe
      const existeUsuario = await Usuario.findOne({ email });
      if (!existeUsuario) {
        throw new Error("No se encontró un usuario con ese correo");
      }

      // Comprobar que las passwords coinciden
      const passwordCorrecto = await bcryptjs.compare(
        password,
        existeUsuario.password
      );
      if (!passwordCorrecto) {
        throw new Error("La contraseña es incorrecta");
      }

      // Crear token
      return {
        token: crearToken(existeUsuario, process.env.SECRETA, "24hr"),
      };
    },
    eliminarProducto: async (_, { id }) => {
      // Revisar si el producto existe
      let producto = await Producto.findByIdAndDelete(id);

      if (!producto) {
        throw new Error("El producto no existe");
      }

      // Eliminar producto
      return "Producto eliminado";
    },
    nuevoProducto: async (_, { input }, { usuario: usuarioToken }) => {
      console.log("input", input);
      console.log("user", usuarioToken);
      const newProduct = await new Producto(input);

      if (!newProduct) throw new Error("No se pudo crear el producto");

      // Revisar si el user anda registrado
      const usuario = await Usuario.findById(usuarioToken.id);
      usuario.productos.push(newProduct.id);
      console.log(usuario);

      /*usuario.populate({
        path: "productos"
      });*/

      await usuario.save();
      newProduct.save();

      return newProduct;
    },
    editarUsuario: async (_, { input }, { usuario }) => {
      try {
        const { password, ...inputbien } = input;
        if (input.password && password.lenght > 0) {
          const salt = await bcryptjs.genSalt(10);
          inputbien.password = await bcryptjs.hash(input.password, salt);
        }
        const updatedUser = await Usuario.findByIdAndUpdate(
          usuario.id,
          { $set: inputbien },
          { new: true }
        );

        if (!updatedUser) {
          throw new Error("El usuario no fue encontrado");
        }

        return updatedUser;
      } catch (error) {
        console.error("Error al editar usuario:", error);
        throw new Error("Hubo un error al editar el usuario");
      }
    },
    nuevaNotificacion: async (_, { input }) => {
      console.log(input.usuario);
      const newNotification = await new Notification(input);

      if (!newNotification)
        throw new Error("No se recibio ninguna notificacion");

      await newNotification.save();

      newNotification.usuario = await Usuario.findById(newNotification.usuario);
      newNotification.producto = await Producto.findById(newNotification.producto);
      console.log(newNotification);

      await sendEmail({
        to : newNotification.usuario.email,
        subject : `Tu producto alcanzó el precio de Stop`,
        html: newNotification.notification
      })
      return newNotification;
    },
  },
};

export default resolvers;
