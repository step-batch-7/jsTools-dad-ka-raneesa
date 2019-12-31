'use strict';

const { filterUserOptions, loadLines } = require('./tailLib.js');
const { parseUserOptions } = require('./parseUserOptions');
let inputStream = process.stdin;

// const tailStdin = function(readStream, linesRequired, printEndResult) {
//   const stdinLines = [];
//   readStream.on('data', data => {
//     stdinLines.push(
//       ...data
//         .toSting()
//         .trim()
//         .split('\n')
//     );
//   });
//   readStream.on('end', () => {
//     printEndResult({
//       error: '',
//       lastLines: getLastLines(stdinLines, linesRequired)
//     });
//   });
// };

// const readFileAndCut = function(args) {
//   const { linesRequired, filePath, readers, printEndResult } = args;
//   if (filePath) {
//     const { fileError, fileContent } = loadFile(filePath, readers);
//     if (fileError) {
//       printEndResult({ error: fileError, lastLines: '' });
//       return;
//     }
//     printEndResult({
//       error: '',
//       lastLines: getLastLines(fileContent, +linesRequired)
//     });
//     return;
//   }
//   tailStdin(readers.readStream, +linesRequired, printEndResult);
// };

const tail = function(cmdArgs, createReadStream, printEndResult) {
  const userOptions = filterUserOptions(cmdArgs);
  const tailOptions = parseUserOptions(userOptions);
  if (tailOptions.error) {
    printEndResult({ error: tailOptions.error, lastLines: '' });
    return;
  }
  const completeCallBack = function({ errMsg, lastLines }) {
    if (errMsg) {
      printEndResult({ error: errMsg, lastLines: '' });
      return;
    }
    printEndResult({ error: '', lastLines });
  };

  if (tailOptions.filePath) {
    inputStream = createReadStream(tailOptions.filePath);
  }

  loadLines(tailOptions, inputStream, completeCallBack);
  //const linesRequired = tailOptions.linesRequired;
  //const filePath = tailOptions.filePath;
  //readFileAndCut({ linesRequired, filePath, readers, printEndResult });
};

module.exports = { tail };
