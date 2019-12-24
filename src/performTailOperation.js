const {
  filterUserOptions,
  parseUserOptions,
  generateErrorMessage,
  loadFileContent,
  getLastLines
} = require("./tailLib.js");

const performTailOperation = function(cmdArgs, fsUtils) {
  const { isFileExist, reader, encoding } = fsUtils;
  const userOptions = filterUserOptions(cmdArgs);
  const objectOfOptions = parseUserOptions(userOptions);

  if (!isFileExist(objectOfOptions.filePath)) {
    const errMsg = {
      filePath: objectOfOptions.filePath,
      msg: "no such file or directory"
    };
    const error = generateErrorMessage(errMsg);
    return { error: error, lastLines: "" };
  }

  let fileContentWithOptions = loadFileContent(
    objectOfOptions,
    reader,
    encoding
  );
  const lastLines = getLastLines(fileContentWithOptions);
  return { lastLines: lastLines, error: "" };
};

module.exports = { performTailOperation };
