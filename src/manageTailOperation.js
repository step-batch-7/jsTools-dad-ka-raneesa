const fs = require("fs");

const {
  filterUserOptions,
  parseUserOptions,
  generateErrorMessage,
  loadFileContent,
  getLastLines
} = require("./tailLib.js");

const manageTailOperation = function(cmdArgs) {
  const userOptions = filterUserOptions(cmdArgs);
  const objectOfOptions = parseUserOptions(userOptions);

  if (!fs.existsSync(objectOfOptions.filePath)) {
    const errMsg = {
      filePath: objectOfOptions.filePath,
      msg: "no such file or directory"
    };
    throw new Error(generateErrorMessage(errMsg));
  }

  let fileContentWithOptions = loadFileContent(
    objectOfOptions,
    fs.readFileSync,
    "utf8"
  );
  return getLastLines(fileContentWithOptions);
};

module.exports = { manageTailOperation };
