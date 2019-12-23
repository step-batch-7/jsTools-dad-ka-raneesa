"use strict";
const { manageTailOperation } = require("./src/manageTailOperation");
const { stdout, stderr } = require("process");

const main = function(cmdArgs) {
  const result = manageTailOperation(cmdArgs);
  result.error && stderr.write(result.error);
  result.lastLines && stdout.write(result.lastLines);
};

main(process.argv);
