const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.get("Authorization").split(" ")[1];

    // console.log("token:", token);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("decodedToken:", decodedToken);
    if (!decodedToken) {
      const error = new Error("Not authenticated.");
      error.statusCode = 401;
      throw error;
    }
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    next(err);
  }
};
