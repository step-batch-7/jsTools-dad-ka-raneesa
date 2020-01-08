'use strict';

const { createReadStream } = require('fs');
const { stdin, stdout, stderr } = require('process');
const { tail } = require('./src/performTail');
const StreamPicker = require('./src/streamPicker');

const createStdinStream = () => stdin;

const main = function(cmdArgs) {
  const streamPicker = new StreamPicker(createReadStream, createStdinStream);
  tail(cmdArgs, streamPicker, ({ error, lastLines }) => {
    stderr.write(error);
    stdout.write(lastLines);
  }
  );
};

main(process.argv);
