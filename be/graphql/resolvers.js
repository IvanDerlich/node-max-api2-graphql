const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Post = require("../models/post");
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
        process.env.JWT_SECRET,
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
  async createPost({ postInput }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }
    const errors = [];
    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      errors.push({
        message: "Title is invalid. It should be at least 5 characters long",
      });
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({
        message: "Content is invalid. It should be at least 5 characters long",
      });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    try {
      const user = await User.findById(req.userId);
      if (!user) {
        const error = new Error("Invalid user.");
        error.code = 401;
        throw error;
      }
      const post = new Post({
        title: postInput.title,
        content: postInput.content,
        imageUrl: postInput.imageUrl,
        creator: user,
      });
      const createdPost = await post.save();
      user.posts.push(createdPost);
      await user.save();
      return {
        ...createdPost._doc,
        _id: createdPost._id.toString(),
        createdAt: createdPost.createdAt.toISOString(),
        updatedAt: createdPost.updatedAt.toISOString(),
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  async getPosts({ currentPage }, req) {
    console.log("getPosts resolver activated");
    try {
      if (!req.isAuth) {
        const error = new Error("Not authenticated!");
        error.code = 401;
        throw error;
      }
      if (!currentPage) {
        currentPage = 1;
      }
      const perPage = 2;
      const totalItems = await Post.find().countDocuments();

      // if page is greater than the number of pages
      if (currentPage > Math.ceil(totalItems / perPage)) {
        const error = new Error("Page not found.");
        error.code = 422;
        throw error;
      }

      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate("creator")
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
      return {
        posts: posts.map((p) => ({
          ...p._doc,
          _id: p._id.toString(),
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        })),
        totalItems,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
