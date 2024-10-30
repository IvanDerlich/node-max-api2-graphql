const express = require("express");
const { getStatus, updateStatus } = require("../controllers/status");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator");

const statusValidator = [body("status").trim().isLength({ min: 4 })];

router.get("/", isAuth, getStatus);
router.patch("/", isAuth, statusValidator, updateStatus);

module.exports = router;
