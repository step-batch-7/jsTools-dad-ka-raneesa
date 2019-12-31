'use strict';

const { filterUserOptions, loadAndCutLines } = require('./tailLib.js');
const { parseUserOptions } = require('./parseUserOptions');

const tail = function(
  cmdArgs,
  { createReadStream, createStdinStream },
  printEndResult
) {
  const userOptions = filterUserOptions(cmdArgs);
  const tailOptions = parseUserOptions(userOptions);
  if (tailOptions.error) {
    printEndResult({ error: tailOptions.error, lastLines: '' });
    return;
  }
  const completeCallBack = function({ errMsg, lastLines }) {
    if (errMsg) {
      printEndResult({ error: errMsg, lastLines: '' });
      return;
    }
    printEndResult({ error: '', lastLines });
  };

  const inputStream = tailOptions.filePath
    ? createReadStream(tailOptions.filePath)
    : createStdinStream();
  loadAndCutLines(tailOptions, inputStream, completeCallBack);
};

module.exports = { tail };
