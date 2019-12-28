"use strict";

const fs = require("fs");
const { stdin, stdout, stderr } = require("process");
const { tail } = require("./src/performTail");

const tailOutPutPrinters = function({ error, lastLines }) {
  stderr.write(error);
  stdout.write(lastLines);
};

const main = function(cmdArgs) {
  const fsUtils = {
    isFileExist: fs.existsSync,
    reader: fs.readFileSync,
    readStream: stdin
  };
  tail(cmdArgs, fsUtils, tailOutPutPrinters);
};

main(process.argv);
