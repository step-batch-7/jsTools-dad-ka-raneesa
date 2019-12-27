"use strict";

const {
  filterUserOptions,
  parseUserOptions,
  loadFile,
  getLastLines
} = require("./tailLib.js");

const tail = function(cmdArgs, fsUtils, printers) {
  const userOptions = filterUserOptions(cmdArgs);
  const { noOfLines, filePath, inputError } = parseUserOptions(userOptions);
  let lastLines = "";
  let error = "";
  if (inputError) {
    return printers({ error: inputError, lastLines });
  }
  if (filePath) {
    const { fileError, fileContent } = loadFile(filePath, fsUtils);
    if (fileError) return printers({ error: fileError, lastLines });

    lastLines = getLastLines(fileContent, +noOfLines);
    return printers({ error, lastLines });
  }
  const readStream = fsUtils.readStream;
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
    lastLines = getLastLines(stdinLines, +noOfLines);
    printers({ error, lastLines });
  });
};

module.exports = { tail };
