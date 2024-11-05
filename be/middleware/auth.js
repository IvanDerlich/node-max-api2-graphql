const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  try {
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      req.isAuth = false;
      return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    next(err);
  }
};
