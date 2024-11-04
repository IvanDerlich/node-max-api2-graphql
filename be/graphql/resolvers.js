const bcrypt = require("bcryptjs");
const User = require("../models/user");
const validator = require("validator");
const jwt = require("jsonwebtoken");

module.exports = {
  async createUser(args, req) {
    const { email, name, password } = args.userInput;
    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push({ message: "Email is invalid." });
    }
    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 5 })
    ) {
      errors.push({ message: "Password too short!" });
    }
    // Validate presence of name
    if (validator.isEmpty(name)) {
      errors.push({ message: "Name is required." });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        const error = new Error("User exists already!");
        error.code = 422;
        throw error;
      }
      const hashedPw = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        name,
        password: hashedPw,
      });
      const createdUser = await user.save();
      return { ...createdUser._doc, _id: createdUser._id.toString() };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  async login({ email, password }) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        const error = new Error("User not found.");
        error.code = 401;
        throw error;
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        const error = new Error("Password is incorrect.");
        error.code = 401;
        throw error;
      }
      const EXPIRATION = "1h";
      const token = jwt.sign(
        {
          userId: user._id.toString(),
          email: user.email,
        },
        "somesupersecretsecret",
        { expiresIn: EXPIRATION }
      );
      console.log("userid: ", user._id.toString());
      return {
        token,
        userId: user._id.toString(),
        tokenExpiration: EXPIRATION,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
