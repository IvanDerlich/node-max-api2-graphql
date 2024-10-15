const { validationResult } = require("express-validator");

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
exports.postPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("postPost errors:", errors.array());
    console.log("errors:", errors);
    return res.status(422).json({
      message: "Validation failed, entered data is incorrect.",
      errors: errors.array(),
    });
  }
  console.log("postPost requested");
  console.log("body:", req.body);
  const title = req.body.title;
  const content = req.body.content;
  res.status(201).json({
    message: "Post created successfully!",
    post: {
      _id: new Date().toISOString(),
      title,
      content,
      creator: {
        name: "Ivan",
      },
      // image: "images/duck.jpg",
      createdAt: new Date(),
    },
  });
};
