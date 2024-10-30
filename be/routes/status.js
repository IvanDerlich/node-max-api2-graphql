const express = require("express");
const { getStatus } = require("../controllers/status");
const router = express.Router();
const isAuth = require("../middleware/is-auth");

router.get("/", isAuth, getStatus);

module.exports = router;
