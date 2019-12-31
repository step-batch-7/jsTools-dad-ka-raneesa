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
    callBack({ errMsg });
  });

  let lines = '';
  inputStream.on('data', data => {
    lines = lines.concat(data);
  });
  inputStream.on('end', () => {
    const lastLines = getLastLines(tailOptions.linesRequired, lines);
    callBack({ lastLines });
  });
};

const getLastLines = function(linesRequired, lines) {
  const count = Math.abs(linesRequired);
  lines = lines.split('\n');
  const slicedLines = lines.slice(-count).join('\n');
  return slicedLines;
};

module.exports = {
  filterUserOptions,
  loadAndCutLines
};
