const express = require("express");
const corsMiddleware = require("./middleware/cors");
require("dotenv").config();
const mongoose = require("mongoose");

const PORT = process.env.LISTEN_PORT;

const bodyParser = require("body-parser");

const feedRoutes = require("./routes/feed");

const app = express();

app.use(corsMiddleware);

// Middleware to parse json data from incoming requests
app.use(bodyParser.json());

app.use("/feed", feedRoutes);

const connectDB = async () => {
  try {
    console.log("CONNECTION STRING: ", process.env.DB_CONNECTION_STRING);
    const connection = await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

connectDB().then(startServer);
