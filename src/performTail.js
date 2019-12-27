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
  if (filePath) {
    const { fileError, fileContent } = loadFile(filePath, fsUtils);
    if (fileError)
      return printers.error(fileError), printers.lastLines(lastLines);

    lastLines = getLastLines(fileContent, +noOfLines);
    return printers.error(error), printers.lastLines(lastLines);
  }
  const readStream = fsUtils.readStream;
  readStream.setEncoding("utf8");
  const stdinLines = [];
  readStream.on("data", data => {
    stdinLines.push(...data.trim().split("\n"));
  });
  readStream.on("end", () => {
    lastLines = getLastLines(stdinLines, +noOfLines);
    printers.error(error), printers.lastLines(lastLines);
  });
};

module.exports = { tail };
