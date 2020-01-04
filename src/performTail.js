'use strict';

const {filterUserOptions, getLastLines} = require('./tailLib');
const {parseUserOptions} = require('./parseUserOptions');
const {readStream} = require('./streamReader');

const tail = function(cmdArgs, streams, onCompletion) {
  const EMPTY_STRING = '';
  const {createReadStream, createStdinStream} = streams;
  const userOptions = filterUserOptions(cmdArgs);
  const tailOptions = parseUserOptions(userOptions);
  if (tailOptions.error) {
    onCompletion({error: tailOptions.error, lastLines: EMPTY_STRING});
    return;
  }
  const formatTailOutput = function({errMsg, content}) {
    if (errMsg) {
      const error = `tail: ${tailOptions.filePath}: ${errMsg}`;
      onCompletion({error, lastLines: EMPTY_STRING});
      return;
    }
    const lastLines = getLastLines(tailOptions.linesRequired, content);
    onCompletion({error: EMPTY_STRING, lastLines});
  };

  const inputStream = tailOptions.filePath ?
    () => createReadStream(tailOptions.filePath) :
    () => createStdinStream();
  readStream(inputStream(), formatTailOutput);
};

module.exports = {tail};
