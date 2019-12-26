"use strict";

const {
  filterUserOptions,
  parseUserOptions,
  getLastLines
} = require("./tailLib.js");

const tail = function(cmdArgs, fsUtils) {
  const { isFileExist, reader, encoding } = fsUtils;
  const userOptions = filterUserOptions(cmdArgs);
  const { noOfLines, filePath } = parseUserOptions(userOptions);
  let lastLines = "";
  let error = "";
  if (Number.isNaN(+noOfLines)) {
    return { error: `tail: illegal offset -- ${noOfLines}`, lastLines };
  }

  if (!isFileExist(filePath)) {
    let errorMsg = "no such file or directory";
    error = `tail: ${filePath}: ${errorMsg}`;
    return { error, lastLines };
  }

  let fileContent = reader(filePath, encoding);
  lastLines = getLastLines(fileContent, +noOfLines);
  return { error, lastLines };
};

module.exports = { tail };
