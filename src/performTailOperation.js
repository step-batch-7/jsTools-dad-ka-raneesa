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
  const tailResult = { lastLines: "", error: "" };

  if (!isFileExist(parsedOptions.filePath)) {
    const filePath = parsedOptions.filePath;
    let msg = "no such file or directory";
    tailResult.error = `tail: ${filePath}: ${msg}`;
    return tailResult;
  }

  let fileContent = reader(parsedOptions.filePath, encoding);
  tailResult.lastLines = getLastLines(fileContent, parsedOptions.noOfLines);
  return tailResult;
};

module.exports = { performTailOperation };
