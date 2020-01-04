'use strict';

class Reader {
  constructor() {
    this.content = '';
  }
  append(chunk) {
    this.content += chunk;
  }
}

const fileErrors = {
  ENOENT: 'No such file or directory',
  EISDIR: '',
  EACCES: 'Permission denied'
};

const readStream = (readableStream, formatTailOutput) => {
  const reader = new Reader();
  readableStream.on('error', (error) => {
    formatTailOutput({errMsg: fileErrors[error.code], content: ''});
  });
  readableStream.on('data', (chunk) => {
    reader.append(chunk);
  });
  readableStream.on('end', () => {
    formatTailOutput({content: reader.content, errMsg: ''});
  });
};
module.exports = {readStream};
