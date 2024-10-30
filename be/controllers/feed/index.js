const Post = require("../../models/post");
const clearImage = require("./helpers").clearImage;

exports.updatePost = require("./updatePost");
exports.postPost = require("./postPost");

exports.getPosts = async (req, res, next) => {
  // console.log("getPosts requested");
  const currentPage = req.query.page || 1;
  const perPage = 2;

  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res.status(200).json({
      message: "Fetched posts successfully.",
      posts,
      totalItems,
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

exports.deletePost = async (req, res, next) => {
  console.log("deletePost requested in the backend");
  const postId = req.params.postId;
  console.log("postId:", postId);
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }
    // Check if user is authorized to delete post

    clearImage(post.imageUrl);
    const result = await Post.findByIdAndDelete(postId);
    console.log("result:", result);

    res.status(200).json({ message: "Post deleted succesfully", result });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
