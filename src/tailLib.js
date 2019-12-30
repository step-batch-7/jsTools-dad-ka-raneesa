'use strict';

const filterUserOptions = function(cmdArgs) {
  const [, , ...userOptions] = [...cmdArgs];
  return userOptions;
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
  loadFile,
  getLastLines
};
