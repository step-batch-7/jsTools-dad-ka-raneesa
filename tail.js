'use strict';

const {createReadStream} = require('fs');
const {stdin, stdout, stderr} = require('process');
const {tail} = require('./src/performTail');

const printEndResult = function({error, lastLines}) {
  stderr.write(error);
  stdout.write(lastLines);
};

const createStdinStream = () => stdin;

const main = function(cmdArgs) {
  tail(cmdArgs, {createReadStream, createStdinStream}, printEndResult);
};

main(process.argv);
