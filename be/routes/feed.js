const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const { getPosts, postPost } = require("../controllers/feed");

const postPostValidator = [
  body("title").trim().isLength({ min: 5 }),
  body("content").trim().isLength({ min: 5 }),
];

router.get("/posts", getPosts);
router.post("/post", postPostValidator, postPost);

module.exports = router;
