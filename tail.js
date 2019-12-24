"use strict";

const { utilityFunctions } = require("./config.js");
const { isFileExist, reader, encoding } = utilityFunctions();
const { manageTailOperation } = require("./src/manageTailOperation");
const { stdout, stderr } = require("process");

const main = function(cmdArgs) {
  const result = manageTailOperation(cmdArgs, isFileExist, reader, encoding);
  result.error && stderr.write(result.error);
  result.lastLines && stdout.write(result.lastLines);
};

main(process.argv);
