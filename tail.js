'use strict';

const fs = require('fs');
const { stdout, stderr } = require('process');
const { tail } = require('./src/performTail');

const printEndResult = function({ error, lastLines }) {
  stderr.write(error);
  stdout.write(lastLines);
};

const main = function(cmdArgs) {
  tail(cmdArgs, fs.createReadStream, printEndResult);
};

main(process.argv);
