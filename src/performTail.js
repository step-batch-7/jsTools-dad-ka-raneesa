'use strict';

const { filterUserOptions, loadAndCutLines } = require('./tailLib.js');
const { parseUserOptions } = require('./parseUserOptions');

const tail = function(cmdArgs, streams, onCompletion) {
  const { createReadStream, createStdinStream } = streams;
  const userOptions = filterUserOptions(cmdArgs);
  const tailOptions = parseUserOptions(userOptions);
  if (tailOptions.error) {
    onCompletion({ error: tailOptions.error, lastLines: '' });
    return;
  }
  const formatTailOutput = function({ errMsg, lastLines }) {
    if (errMsg) {
      onCompletion({ error: errMsg, lastLines: '' });
      return;
    }
    onCompletion({ error: '', lastLines });
  };

  const inputStream = tailOptions.filePath
    ? createReadStream(tailOptions.filePath)
    : createStdinStream();
  loadAndCutLines(tailOptions, inputStream, formatTailOutput);
};

module.exports = { tail };
