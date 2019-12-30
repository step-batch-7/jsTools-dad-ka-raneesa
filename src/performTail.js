'use strict';

const { filterUserOptions, loadFile, getLastLines } = require('./tailLib.js');
const { parseUserOptions } = require('./parseUserOptions');

const tailStdin = function(readStream, linesRequired, printEndResult) {
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
    printEndResult({
      error: '',
      lastLines: getLastLines(stdinLines, linesRequired)
    });
  });
};

const readFileAndCut = function(args) {
  const { linesRequired, filePath, fsUtils, printEndResult } = args;
  if (filePath) {
    const { fileError, fileContent } = loadFile(filePath, fsUtils);
    if (fileError) {
      printEndResult({ error: fileError, lastLines: '' });
      return;
    }
    printEndResult({
      error: '',
      lastLines: getLastLines(fileContent, +linesRequired)
    });
    return;
  }
  tailStdin(fsUtils.readStream, +linesRequired, printEndResult);
};

const tail = function(cmdArgs, fsUtils, printEndResult) {
  const userOptions = filterUserOptions(cmdArgs);
  const tailOptions = parseUserOptions(userOptions);
  if (tailOptions.error) {
    printEndResult({ error: tailOptions.error, lastLines: '' });
    return;
  }
  const linesRequired = tailOptions.linesRequired;
  const filePath = tailOptions.filePath;
  readFileAndCut({ linesRequired, filePath, fsUtils, printEndResult });
};

module.exports = { tail };
