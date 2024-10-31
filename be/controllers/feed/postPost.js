const { validationResult } = require("express-validator");
const Post = require("../../models/post");
const User = require("../../models/user");
const io = require("../../socket");

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

    const updatedPost = await post.save();
    console.log("response:", updatedPost._doc);
    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    user.posts.push(post);
    user.save();

    // Inform all users that a new post has been created
    io.getIO().emit("posts", {
      action: "create",
      post: {
        ...updatedPost._doc,
        creator: {
          _id: user._id,
          name: user.name,
        },
      },
    });

    res.status(201).json({
      message: "Post created successfully!",
      post: updatedPost,
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
