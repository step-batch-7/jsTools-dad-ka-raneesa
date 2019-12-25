"use strict";

const {
  filterUserOptions,
  parseUserOptions,
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

  let fileContent = reader(parsedOptions.filePath, encoding);
  result.lastLines = getLastLines(fileContent, parsedOptions.noOfLines);
  return result;
};

module.exports = { performTailOperation };
