"use strict";

const filterUserOptions = function(cmdArgs) {
  let [, , ...userOptions] = [...cmdArgs];
  return userOptions;
};

const parseUserOptions = function(userOptions) {
  if (userOptions[0] == "-n") {
    const noOfLines = userOptions[1];
    const filePath = userOptions[2];
    return { noOfLines, filePath };
  }
  return { filePath: userOptions[0], noOfLines: 10 };
};

const loadFile = function(filePath, fsUtils) {
  const { isFileExist, reader } = fsUtils;
  if (!isFileExist(filePath)) {
    let errorMsg = "no such file or directory";
    const fileError = `tail: ${filePath}: ${errorMsg}`;
    return { fileError };
  }
  let fileContent = reader(filePath, "utf8");
  fileContent = fileContent.split("\n");
  return { fileContent };
};

const getLastLines = function(fileContent, noOfLines) {
  const count = Math.abs(noOfLines);
  let slicedLines = fileContent.slice(-count).join("\n");
  return slicedLines;
};

module.exports = {
  filterUserOptions,
  parseUserOptions,
  loadFile,
  getLastLines
};
