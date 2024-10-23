const Post = require("../../models/post");
const clearImage = require("./helpers").clearImage;

module.exports = async (req, res, next) => {
  console.log("updatePost requested");
  console.log("req.file: ", req.file);
  console.log("req.body.image: ", req.body.image);
  const id = req.params.postId;
  console.log("id:", id);
  const imageUrl = req.file ? req.file.path : req.body.image;
  console.log("imageUrl:", imageUrl);
  const title = req.body.title;
  console.log("title:", title);
  const content = req.body.content;
  console.log("content:", content);

  try {
    if (!imageUrl) {
      const error = new Error("No file picked.");
      error.statusCode = 422;
      throw error;
    }
    const post = await Post.findById(id);

    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }

    // check if user is authorized to update post

    const oldImageUrl = post.imageUrl;
    console.log("oldImageUrl:", oldImageUrl);

    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    console.log("new imageUrl:", post.imageUrl);

    const response = await post.save();

    if (imageUrl !== oldImageUrl) {
      clearImage(oldImageUrl);
    }

    return res.status(200).json({ message: "Post updated!", post: response });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};