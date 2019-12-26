"use strict";

const fs = require("fs");
const { stdout, stderr } = require("process");
const { performTailOperation } = require("./src/performTailOperation");

const main = function(cmdArgs) {
  const fsUtils = {
    isFileExist: fs.existsSync,
    reader: fs.readFileSync,
    encoding: "utf8"
  };
  const { error, lastLines } = performTailOperation(cmdArgs, fsUtils);
  stderr.write(error);
  stdout.write(lastLines);
};

main(process.argv);
