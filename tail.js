"use strict";
const fs = require("fs");
const { performTailOperation } = require("./src/performTailOperation");
const { stdout, stderr } = require("process");

const utilityFunctions = function() {
  return {
    isFileExist: fs.existsSync,
    reader: fs.readFileSync,
    encoding: "utf8"
  };
};

const main = function(cmdArgs) {
  const { isFileExist, reader, encoding } = utilityFunctions();
  const result = performTailOperation(cmdArgs, isFileExist, reader, encoding);
  result.error && stderr.write(result.error);
  result.lastLines && stdout.write(result.lastLines);
};

main(process.argv);
