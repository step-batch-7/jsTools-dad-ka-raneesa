"use strict";

const fs = require("fs");
const { stdout, stderr } = require("process");
const { tail } = require("./src/performTail");

const main = function(cmdArgs) {
  const fsUtils = {
    isFileExist: fs.existsSync,
    reader: fs.readFileSync
  };

  const tailOutPutPrinters = {
    error: error => {
      stderr.write(error);
    },
    lastLines: lastLines => {
      stdout.write(lastLines);
    }
  };
  tail(cmdArgs, fsUtils, tailOutPutPrinters);
};

main(process.argv);
