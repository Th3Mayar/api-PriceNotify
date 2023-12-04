const { gql } = require("apollo-server");

// Schema
const typeDefs = gql`
  type Usuario {
    id: ID
    nombre: String
    apellido: String
    email: String
    password: String
    gender: Gender
    phone: String
    address: String
    creado: String
  }
  
  enum Gender {
    Male
    Female
    Other
  }

  type Token {
    token: String!
  }

  type Producto {
    id: ID
    nombre: String
    existencia: Int
    precio: Float
    creado: String
  }

  input ProductoInput {
    nombre: String!
    existencia: Int
    precio: Float
  }
  
  input UsuarioInput {
    nombre: String
    apellido: String
    email: String!
    password: String!
    gender: Gender
    phone: String
    address: String
  }

  input AutenticarInput {
    email: String!
    password: String!
  }
  
  type Query {
    #Usuarios
    obtenerUsuario(token: String!): Usuario

    #Productos
    obtenerProductos: [Producto]
    obtenerProducto(id: ID!): Producto
  }

  type Mutation {
    #Usuarios
    nuevoUsuario(input: UsuarioInput): Usuario
    autenticarUsuario(input: AutenticarInput): Token

    #Productos
    nuevoProducto(input: ProductoInput): Producto
    actualizarProducto(id: ID!, input: ProductoInput): Producto
    eliminarProducto(id: ID!): String
  }
`;

module.exports = typeDefs;
