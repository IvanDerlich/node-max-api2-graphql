const { validationResult } = require("express-validator");
const Post = require("../../models/post");
const User = require("../../models/user");

module.exports = async (req, res, next) => {
  console.log("postPost requested");
  console.log("body:", req.body);
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      throw error;
    }

    if (!req.file) {
      const error = new Error("No image provided.");
      error.statusCode = 422;
      throw error;
    }

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imageUrl: req.file.path,
      creator: req.userId,
    });

    const response = await post.save();
    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    user.posts.push(post);
    user.save();

    res.status(201).json({
      message: "Post created successfully!",
      post: response,
      creatorName: {
        _id: user._id,
        name: user.name,
      },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
