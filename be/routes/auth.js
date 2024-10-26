const express = require("express");
const { body } = require("express-validator");
const { signup } = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

const signupValidator = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email")
    .custom(async (value, { req }) => {
      const userDoc = await User.findOne({ email: value });
      if (userDoc) {
        throw new Error("E-Mail address already exists!");
      }
    })
    .normalizeEmail(),
  body("name").trim().not().isEmpty().withMessage("Name is required"),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters"),
];

router.put("/signup", signupValidator, signup);

module.exports = router;
