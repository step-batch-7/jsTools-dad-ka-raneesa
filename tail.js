'use strict';

const { createReadStream } = require('fs');
const { stdin, stdout, stderr } = require('process');
const { tail } = require('./src/performTail');
const StreamPicker = require('./src/streamPicker');

const printEndResult = function({ error, lastLines }) {
  stderr.write(error);
  stdout.write(lastLines);
};

const createStdinStream = () => stdin;

const main = function(cmdArgs) {
  const streamPicker = new StreamPicker(createReadStream, createStdinStream);
  tail(cmdArgs, streamPicker, printEndResult);
};

main(process.argv);
