const fs = require("fs");

const utilityFunctions = function() {
  return {
    isFileExist: fs.existsSync,
    reader: fs.readFileSync,
    encoding: "utf8"
  };
};

module.exports = { utilityFunctions };
