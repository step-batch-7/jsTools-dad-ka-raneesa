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

const getLastLines = function(fileContent, noOfLines) {
  let lines = fileContent.split("\n");
  let count = Math.abs(noOfLines);
  let slicedLines = lines.reverse().slice(0, count);
  return slicedLines.reverse().join("\n");
};

module.exports = {
  filterUserOptions,
  parseUserOptions,
  getLastLines
};
