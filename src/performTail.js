"use strict";

const {
  filterUserOptions,
  parseUserOptions,
  loadFile,
  getLastLines
} = require("./tailLib.js");

const tail = function(cmdArgs, fsUtils) {
  const userOptions = filterUserOptions(cmdArgs);
  const { noOfLines, filePath } = parseUserOptions(userOptions);
  let lastLines = "";
  let error = "";
  if (Number.isNaN(+noOfLines)) {
    return { error: `tail: illegal offset -- ${noOfLines}`, lastLines };
  }

  const { fileError, fileContent } = loadFile(filePath, fsUtils);
  if (fileError) {
    return { error: fileError, lastLines };
  }

  lastLines = getLastLines(fileContent, +noOfLines);
  return { error, lastLines };
};

module.exports = { tail };
