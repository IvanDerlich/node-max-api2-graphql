const fs = require("fs");
const path = require("path");

exports.clearImage = (filePath) => {
  console.log("clearImage requested");
  console.log("filePath:", filePath);
  filePath = path.join(__dirname, "../..", filePath);
  console.log("filePath:", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
