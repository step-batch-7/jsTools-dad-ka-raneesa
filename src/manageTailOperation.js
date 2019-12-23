const { utilityFunctions } = require("./config.js");
const { isFileExist, reader, encoding } = utilityFunctions();

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
    const error = generateErrorMessage(errMsg);
    return { error: error };
  }

  let fileContentWithOptions = loadFileContent(
    objectOfOptions,
    reader,
    encoding
  );
  const lastLines = getLastLines(fileContentWithOptions);
  return { lastLines: lastLines };
};

module.exports = { manageTailOperation };
