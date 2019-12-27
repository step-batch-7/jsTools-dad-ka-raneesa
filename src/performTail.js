"use strict";

const {
  filterUserOptions,
  parseUserOptions,
  loadFile,
  getLastLines
} = require("./tailLib.js");

const tail = function(cmdArgs, fsUtils, printers) {
  const userOptions = filterUserOptions(cmdArgs);
  const { noOfLines, filePath } = parseUserOptions(userOptions);
  let lastLines = "";
  let error = "";
  if (Number.isNaN(+noOfLines))
    return (
      printers.error(`tail: illegal offset -- ${noOfLines}`),
      printers.lastLines(lastLines)
    );
  const { fileError, fileContent } = loadFile(filePath, fsUtils);
  if (fileError)
    return printers.error(fileError), printers.lastLines(lastLines);

  lastLines = getLastLines(fileContent, +noOfLines);
  return printers.error(error), printers.lastLines(lastLines);
};

module.exports = { tail };
