const User = require("../../models/user");
const { validationResult } = require("express-validator");

exports.getStatus = async (req, res, next) => {
  console.log("status requested");

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    res.json({ status: user.status });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  console.log("status update requestes");
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    user.status = req.body.status;
    await user.save();
    res.status(200).json({
      message: "Status Changed Succesfully",
      oldStatus: user.status,
      newStatus: req.body.status,
    });
  } catch (error) {
    next(error);
  }
};
