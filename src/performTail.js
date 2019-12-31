'use strict';

const { filterUserOptions, loadAndCutLines } = require('./tailLib.js');
const { parseUserOptions } = require('./parseUserOptions');

const tail = function(cmdArgs, { createReadStream, stdin }, printEndResult) {
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
  let inputStream = stdin;
  if (tailOptions.filePath) {
    inputStream = createReadStream(tailOptions.filePath);
  }
  loadAndCutLines(tailOptions, inputStream, completeCallBack);
};

module.exports = { tail };
