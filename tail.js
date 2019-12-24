"use strict";
const fs = require("fs");
const { performTailOperation } = require("./src/performTailOperation");
const { stdout, stderr } = require("process");

const main = function(cmdArgs) {
  const fsUtils = {
    isFileExist: fs.existsSync,
    reader: fs.readFileSync,
    encoding: "utf8"
  };
  const result = performTailOperation(cmdArgs, fsUtils);
  result.error && stderr.write(result.error);
  result.lastLines && stdout.write(result.lastLines);
};

main(process.argv);
