const express = require("express");

const router = express.Router();

router.put("/signup", (req, res, next) => {
  res.status(201).json({ message: "User created." });
});

module.exports = router;
