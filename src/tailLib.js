"use strict";

const filterUserOptions = function(cmdArgs) {
  let [, , ...userOptions] = [...cmdArgs];
  return userOptions;
};

const parseUserOptions = function(userOptions) {
  if (userOptions[0] == "-n") {
    const noOfLines = +userOptions[1];
    const filePath = userOptions[2];
    return { noOfLines, filePath };
  }
  return { filePath: userOptions[0], noOfLines: 10 };
};

const generateErrorMessage = function(errMsg) {
  return `tail: ${errMsg.filePath}: ${errMsg.msg}`;
};

const loadFileContent = function(objectOfOptions, reader, encoding) {
  objectOfOptions.data = reader(objectOfOptions.filePath, encoding);
  return objectOfOptions;
};

const getLastLines = function(contentWithOptions) {
  let lines = contentWithOptions.data.split("\n");
  let count = Math.abs(contentWithOptions.noOfLines);
  let slicedLines = lines.reverse().slice(0, count);
  return slicedLines.reverse().join("\n");
};

module.exports = {
  filterUserOptions,
  parseUserOptions,
  generateErrorMessage,
  loadFileContent,
  getLastLines
};
