const express = require("express");
const { getStatus } = require("../controllers/status");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const User = require("../models/user");

router.get("/", isAuth, getStatus);
router.patch("/", isAuth, async (req, res, next) => {
  console.log("status updated");
  try {
    const user = await User.findById(req.userId);
    user.status = req.body.status;
    await user.save();
    res.status(200).json({ status: "updated" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
