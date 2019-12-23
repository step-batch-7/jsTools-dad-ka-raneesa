const { utilityFunctions } = require("./config.js");
const { isFileExist, reader, encoding } = utilityFunctions;

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

  if (!isFileExist(objectOfOptions.filePath)) {
    const errMsg = {
      filePath: objectOfOptions.filePath,
      msg: "no such file or directory"
    };
    throw new Error(generateErrorMessage(errMsg));
  }

  let fileContentWithOptions = loadFileContent(
    objectOfOptions,
    reader,
    encoding
  );
  return getLastLines(fileContentWithOptions);
};

module.exports = { manageTailOperation };
