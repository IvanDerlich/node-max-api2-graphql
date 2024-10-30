const User = require("../../models/user");

exports.getStatus = async (req, res, next) => {
  console.log("status requested");
  try {
    const user = await User.findById(req.userId);
    res.json({ status: user.status });
  } catch (error) {
    next(error);
  }
};
