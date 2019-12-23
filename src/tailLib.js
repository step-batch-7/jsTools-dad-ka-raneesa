const filterUserOptions = function(cmdArgs) {
  let [, , ...userOptions] = [...cmdArgs];
  return userOptions;
};

const parseUserOptions = function(userOptions) {
  const parsedOptions = {};
  if (userOptions[0] == "-n") {
    parsedOptions.noOfLines = +userOptions[1];
    parsedOptions.filePath = userOptions[2];
    return parsedOptions;
  }
  parsedOptions.filePath = userOptions[0];
  parsedOptions.noOfLines = 10;
  return parsedOptions;
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
