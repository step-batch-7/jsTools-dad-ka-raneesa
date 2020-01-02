'use strict';

const filterUserOptions = function(cmdArgs) {
  const [, , ...userOptions] = [...cmdArgs];
  return userOptions;
};
const getErrorMessage = (errCode, filePath) => {
  const fileErrorMsg = {
    ENOENT: `tail: ${filePath}: No such file or directory`,
    EACCES: `tail: ${filePath}: Permission denied`,
    EISDIR: ''
  };
  return fileErrorMsg[errCode];
};

const loadAndCutLines = function(tailOptions, inputStream, callBack) {
  inputStream.on('error', error => {
    const errMsg = getErrorMessage(error.code, tailOptions.filePath);
    callBack({ errMsg, lastLines: '' });
  });

  let lines = '';
  inputStream.on('data', data => {
    lines = lines.concat(data);
  });
  inputStream.on('end', () => {
    const lastLines = getLastLines(tailOptions.linesRequired, lines);
    callBack({ lastLines, errMsg: '' });
  });
};

const getLastLines = function(linesRequired, lines) {
  const count = Math.abs(linesRequired);
  const content = lines.split('\n');
  const slicedLines = content.slice(-count).join('\n');
  return slicedLines;
};

module.exports = {
  filterUserOptions,
  loadAndCutLines
};
