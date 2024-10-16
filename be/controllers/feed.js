const { validationResult } = require("express-validator");

const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  console.log("getPosts requested");
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        content: "This is the first post!",
        imageUrl: "images/duck.jpg",
        creator: {
          name: "Maximilian",
        },
        createdAt: new Date(),
      },
      {
        _id: "2",
        title: "Second Post",
        content: "This is the second post!",
        imageUrl: "images/duck.jpg",
        creator: {
          name: "Ivan",
        },
        createdAt: new Date(),
      },
    ],
  });
};
exports.postPost = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      throw error;
    }
    console.log("postPost requested");
    console.log("body:", req.body);
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

exports.getPost = (req, res, next) => {
  console.log("getPost requested");
  const postId = req.params.postId;
  console.log("postId:", postId);
  res.status(200).json({
    post: {
      _id: "1",
      title: "First Post",
      content: "This is the first post!",
      imageUrl: "images/duck.jpg",
      creator: {
        name: "Maximilian",
      },
      createdAt: new Date(),
    },
  });
};
