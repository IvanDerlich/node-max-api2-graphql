const express = require("express");

const router = express.Router();

const { signup } = require("../controllers/auth");

router.put("/signup", signup);

module.exports = router;
