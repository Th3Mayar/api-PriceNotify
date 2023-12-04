import { ApolloServer } from "apollo-server";
import typeDefs from "./db/schema.js";
import resolvers from "./db/resolvers.js";
import connectDB from "./config/db.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config({ path: "variables.env" });

// connect to data base
connectDB();

// servidor
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    //console.log(req.headers["authorization"]);
    const token = req.headers["authorization"] || "";

    if (token) {
      try {
        const usuario = jwt.verify(token, process.env.SECRETA);
        
        //console.log(usuario);

        return {
          usuario
        }
        
      } catch (error) {
        console.log("Hubo un error");
        console.log(error);
      }
    }
  },
});

// arranque del servidor
server.listen().then(({ url }) => {
  console.log(`Servidor iniciado en la url ${url}`);
});
