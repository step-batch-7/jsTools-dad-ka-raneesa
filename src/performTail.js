'use strict';

const {
  filterUserOptions,
  parseUserOptions,
  loadFile,
  getLastLines
} = require('./tailLib.js');
const { validateUserOptions } = require('./inputValidation');

const tailStdin = function(readStream, noOfLines, printers) {
  const stdinLines = [];
  readStream.on('data', data => {
    stdinLines.push(
      ...data
        .toSting()
        .trim()
        .split('\n')
    );
  });
  readStream.on('end', () => {
    printers({ error: '', lastLines: getLastLines(stdinLines, noOfLines) });
  });
};

const checkFileAndRead = function(args) {
  const { noOfLines, filePath, fsUtils, printers } = args;
  if (filePath) {
    const { fileError, fileContent } = loadFile(filePath, fsUtils);
    if (fileError) {
      printers({ error: fileError, lastLines: '' });
      return;
    }
    printers({
      error: '',
      lastLines: getLastLines(fileContent, +noOfLines)
    });
    return;
  }
  tailStdin(fsUtils.readStream, +noOfLines, printers);
};

const tail = function(cmdArgs, fsUtils, printers) {
  const userOptions = filterUserOptions(cmdArgs);
  const startIndex = 0;
  if (userOptions[startIndex]) {
    const inputError = validateUserOptions(userOptions);
    if (inputError) {
      printers({ error: inputError, lastLines: '' });
      return;
    }
  }
  const { noOfLines, filePath } = parseUserOptions(userOptions);
  checkFileAndRead({ noOfLines, filePath, fsUtils, printers });
};

module.exports = { tail };
