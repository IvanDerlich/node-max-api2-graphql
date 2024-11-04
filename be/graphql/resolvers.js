const bcrypt = require("bcryptjs");
const User = require("../models/user");

module.exports = {
  async createUser(args, req) {
    const { email, name, password } = args.UserInput;
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
};
