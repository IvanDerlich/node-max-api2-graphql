const { validationResult } = require("express-validator");

const Post = require("../models/post");

exports.getPosts = async (req, res, next) => {
  console.log("getPosts requested");
  try {
    const posts = await Post.find();
    res.status(200).json({
      message: "Fetched posts successfully.",
      posts,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
exports.postPost = async (req, res, next) => {
  console.log("postPost requested");
  console.log("body:", req.body);
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      throw error;
    }

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imageUrl: "images/duck.jpg",
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

exports.getPost = async (req, res, next) => {
  console.log("getPost requested");
  const postId = req.params.postId;
  console.log("postId:", postId);
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Post fetched.", post });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
