const express = require("express");

const bodyParser = require("body-parser");

const feedRoutes = require("./routes/feed");

const app = express();

// Middleware to parse json data from incoming requests
app.use(bodyParser.json());

const allowedOrigins = ["http://localhost:3000"];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log("origin: ", origin);
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
