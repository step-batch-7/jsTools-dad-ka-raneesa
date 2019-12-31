'use strict';

const filterUserOptions = function(cmdArgs) {
  const [, , ...userOptions] = [...cmdArgs];
  return userOptions;
};

const loadAndCutLines = function(tailOptions, inputStream, callBack) {
  const fileErrors = {
    ENOENT: 'No such file or directory',
    EACCES: 'Permission denied'
  };
  inputStream.on('error', error => {
    const errMsg = `tail: ${tailOptions.filePath}: ${fileErrors[error.code]}`;
    process.exitCode = 2;
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
