"use strict";

const {
  filterUserOptions,
  parseUserOptions,
  loadFileContent,
  getLastLines
} = require("./tailLib.js");

const performTailOperation = function(cmdArgs, fsUtils) {
  const { isFileExist, reader, encoding } = fsUtils;
  const userOptions = filterUserOptions(cmdArgs);
  const parsedOptions = parseUserOptions(userOptions);
  const result = { lastLines: "", error: "" };

  if (!isFileExist(parsedOptions.filePath)) {
    const filePath = parsedOptions.filePath,
      msg = "no such file or directory";
    result.error = `tail: ${filePath}: ${msg}`;
    return result;
  }

  let fileContentWithOptions = loadFileContent(parsedOptions, reader, encoding);
  result.lastLines = getLastLines(fileContentWithOptions);
  return result;
};

module.exports = { performTailOperation };
