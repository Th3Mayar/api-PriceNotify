const Usuario = require("../models/Usuario");
const Producto = require("../models/Producto");

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

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
      console.log(usuarioToken)
      if (!usuarioToken) throw new Error("No se pudo autenticar el token");
      try {
        const usuarioDB = await Usuario.findById(usuarioToken.id);
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
      let producto = await Producto.findById(id);
      if (!producto) {
        throw new Error("El producto no existe");
      }

      // Eliminar producto
      await Producto.findByIdAndDelete({ _id: id });
      return "Producto eliminado";
    },
  },
};

module.exports = resolvers;
