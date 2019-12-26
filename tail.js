"use strict";

const fs = require("fs");
const { stdout, stderr } = require("process");
const { tail } = require("./src/performTail");

const main = function(cmdArgs) {
  const fsUtils = {
    isFileExist: fs.existsSync,
    reader: fs.readFileSync,
    encoding: "utf8"
  };
  const { error, lastLines } = tail(cmdArgs, fsUtils);
  stderr.write(error);
  stdout.write(lastLines);
};

main(process.argv);
