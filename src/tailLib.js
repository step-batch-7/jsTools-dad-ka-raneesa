'use strict';

const filterUserOptions = function(cmdArgs) {
  const [, , ...userOptions] = [...cmdArgs];
  return userOptions;
};

const parseUserOptions = function(userOptions) {
  const firstIndex = 0;
  const secondIndex = 1;
  const thirdIndex = 2;
  let noOfLines = 10;
  let filePath = userOptions[firstIndex];
  if (userOptions[firstIndex] === '-n') {
    noOfLines = userOptions[secondIndex];
    filePath = userOptions[thirdIndex];
  }
  return { filePath, noOfLines };
};

const loadFile = function(filePath, fsUtils) {
  const { isFileExist, reader } = fsUtils;
  if (!isFileExist(filePath)) {
    const errorMsg = 'no such file or directory';
    const fileError = `tail: ${filePath}: ${errorMsg}`;
    return { fileError };
  }
  let fileContent = reader(filePath, 'utf8');
  fileContent = fileContent.split('\n');
  return { fileContent };
};

const getLastLines = function(fileContent, noOfLines) {
  const count = Math.abs(noOfLines);
  const slicedLines = fileContent.slice(-count).join('\n');
  return slicedLines;
};

module.exports = {
  filterUserOptions,
  parseUserOptions,
  loadFile,
  getLastLines
};
