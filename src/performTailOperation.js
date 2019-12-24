"use strict";

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
  const result = { lastLines: "", error: "" };

  if (!isFileExist(objectOfOptions.filePath)) {
    const errMsg = {
      filePath: objectOfOptions.filePath,
      msg: "no such file or directory"
    };
    result.error = generateErrorMessage(errMsg);
    return result;
  }

  let fileContentWithOptions = loadFileContent(
    objectOfOptions,
    reader,
    encoding
  );
  result.lastLines = getLastLines(fileContentWithOptions);
  return result;
};

module.exports = { performTailOperation };
