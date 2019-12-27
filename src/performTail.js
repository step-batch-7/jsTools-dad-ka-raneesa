"use strict";

const {
  filterUserOptions,
  parseUserOptions,
  loadFile,
  getLastLines
} = require("./tailLib.js");

const tailStdin = function(readStream, noOfLines) {
  const stdinLines = [];
  readStream.on("data", data => {
    stdinLines.push(
      ...data
        .toSting()
        .trim()
        .split("\n")
    );
  });
  readStream.on("end", () => {
    printers({ error: "", lastLines: getLastLines(stdinLines, noOfLines) });
  });
};

const tail = function(cmdArgs, fsUtils, printers) {
  const userOptions = filterUserOptions(cmdArgs);
  const { noOfLines, filePath, inputError } = parseUserOptions(userOptions);
  if (inputError) {
    printers({ error: inputError, lastLines: "" });
    return;
  }
  if (filePath) {
    const { fileError, fileContent } = loadFile(filePath, fsUtils);
    if (fileError) {
      printers({ error: fileError, lastLines: "" });
      return;
    }
    printers({
      error: "",
      lastLines: getLastLines(fileContent, +noOfLines)
    });
    return;
  }
  tailStdin(fsUtils.readStream, +noOfLines);
};

module.exports = { tail };
