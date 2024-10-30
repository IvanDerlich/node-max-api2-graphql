const express = require("express");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

const {
  getPosts,
  postPost,
  getPost,
  updatePost,
  deletePost,
} = require("../controllers/feed");

const postPostValidator = [
  body("title").trim().isLength({ min: 5 }),
  body("content").trim().isLength({ min: 5 }),
];

const putPostValidator = [
  body("title").trim().isLength({ min: 5 }),
  body("content").trim().isLength({ min: 5 }),
];

router.get("/posts", isAuth, getPosts);
router.post("/post", isAuth, postPostValidator, postPost);
router.get("/post/:postId", isAuth, getPost);
router.put("/post/:postId", isAuth, putPostValidator, updatePost);
router.delete("/post/:postId", isAuth, deletePost);

module.exports = router;
