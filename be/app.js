const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const PORT = process.env.LISTEN_PORT;
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const { createHandler } = require("graphql-http/lib/use/express");
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");

const allowedOrigins = ["http://localhost:3000"];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

const app = express();

// Middleware to handle CORS
app.use(cors(corsOptions));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const validMimeTypes = ["image/png", "image/jpg", "image/jpeg"];
  if (
    validMimeTypes.includes(file.mimetype) &&
    file.originalname.match(/\.(jpg|jpeg|png)$/)
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Middleware to parse json data from incoming requests
app.use(bodyParser.json());

// Middleware to handle file uploads
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));

// Middleware to help the client access the images
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  "/graphql",
  createHandler({ schema: graphqlSchema, rootValue: graphqlResolver })
);

// Middleware to handle errors
app.use((error, req, res, next) => {
  console.error("ERROR: ", error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data: data ?? undefined });
});

const connectDB = async () => {
  try {
    // console.log("CONNECTION STRING: ", process.env.DB_CONNECTION_STRING);
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
