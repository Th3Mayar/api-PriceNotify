const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env" });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {
        useNewUrlParser : true,
        useUnifiedTopology : true
    });
    console.log("DB Conectada");

  } catch (error) {
    console.log("Hubo un error");
    console.log(error);
    process.exit(1); // Detiene la app
  }
};

module.exports = connectDB;
