'use strict';

const {
  filterUserOptions,
  parseUserOptions,
  loadFile,
  getLastLines
} = require('./tailLib.js');
const { validateUserOptions } = require('./inputValidation');

const tailStdin = function(readStream, noOfLines, print) {
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
    print({ error: '', lastLines: getLastLines(stdinLines, noOfLines) });
  });
};

const readFileAndCut = function(args) {
  const { noOfLines, filePath, fsUtils, print } = args;
  if (filePath) {
    const { fileError, fileContent } = loadFile(filePath, fsUtils);
    if (fileError) {
      print({ error: fileError, lastLines: '' });
      return;
    }
    print({
      error: '',
      lastLines: getLastLines(fileContent, +noOfLines)
    });
    return;
  }
  tailStdin(fsUtils.readStream, +noOfLines, print);
};

const tail = function(cmdArgs, fsUtils, print) {
  const userOptions = filterUserOptions(cmdArgs);
  const startIndex = 0;
  if (userOptions[startIndex]) {
    const inputError = validateUserOptions(userOptions);
    if (inputError) {
      print({ error: inputError, lastLines: '' });
      return;
    }
  }
  const { noOfLines, filePath } = parseUserOptions(userOptions);
  readFileAndCut({ noOfLines, filePath, fsUtils, print });
};

module.exports = { tail };
