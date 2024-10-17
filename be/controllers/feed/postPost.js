const { validationResult } = require("express-validator");
const Post = require("../../models/post");

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
      creator: { name: "Ivan" },
    });

    const response = await post.save();
    console.log("response:", response);
    res.status(201).json({
      message: "Post created successfully!",
      post: response,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
