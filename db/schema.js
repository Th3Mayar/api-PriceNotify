import { gql } from "apollo-server";

const typeDefs = gql`
  type Producto {
    id: ID
    nombre: String
    descripcion: String
    precio: Float
    precioStop: Float
    url: String
    createdAt: String
    updatedAt: String
    images: [String]
  }

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
    productos: [Producto]
  }
  
  enum Gender {
    Male
    Female
    Other
  }

  type Token {
    token: String!
  }

  input ProductoInput {
    nombre: String
    descripcion: String
    precio: Float
    precioStop: Float
    url: String
    images: [String]
  }
  
  input UsuarioInput {
    nombre: String!
    apellido: String!
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
    # Usuarios
    obtenerUsuario(token: String!): Usuario
    obtenerUsuariosConProductos: [Usuario]

    # Productos
    obtenerProductos: [Producto]
    obtenerProducto(id: ID!): Producto
  }

  type Mutation {
    # Usuarios
    nuevoUsuario(input: UsuarioInput): Usuario
    autenticarUsuario(input: AutenticarInput): Token

    # Productos
    nuevoProducto(input: ProductoInput): Producto
    actualizarProducto(id: ID!, input: ProductoInput): Producto
    eliminarProducto(id: ID!): String
  }
`;

export default typeDefs;