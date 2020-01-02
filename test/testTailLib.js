'use strict';
const sinon = require('sinon');
const assert = require('chai').assert;
const { EventEmitter } = require('events');
const { filterUserOptions, loadAndCutLines } = require('../src/tailLib');

describe('filterUserOptions', function() {
  it('Should give file name in an array', function() {
    const actual = filterUserOptions(['node', 'tail.js', 'a.txt']);
    assert.deepStrictEqual(actual, ['a.txt']);
  });

  it('Should give no of line and file name an array', function() {
    const actual = filterUserOptions(['node', 'tail.js', '-n', '8', 'a.txt']);
    assert.deepStrictEqual(actual, ['-n', '8', 'a.txt']);
  });
});

describe('loadAndCutLines', function() {
  it('Should give error if file is not present', function() {
    const formatTailOutput = sinon.fake();
    const errMsg = 'tail: badFile: No such file or directory';
    const inputStream = new EventEmitter();
    loadAndCutLines({ filePath: 'badFile' }, inputStream, formatTailOutput);
    inputStream.emit('error', { code: 'ENOENT' });
    assert.ok(formatTailOutput.calledWith({ errMsg, lastLines: '' }));
  });

  it('Should give error if file permission is denied', function() {
    const formatTailOutput = sinon.fake();
    const errMsg = 'tail: badFile: Permission denied';
    const inputStream = new EventEmitter();
    loadAndCutLines({ filePath: 'badFile' }, inputStream, formatTailOutput);
    inputStream.emit('error', { code: 'EACCES' });
    assert.ok(formatTailOutput.calledWith({ errMsg, lastLines: '' }));
  });

  it('Should give error as empty string if we give directory only', function() {
    const formatTailOutput = sinon.fake();
    const errMsg = '';
    const inputStream = new EventEmitter();
    loadAndCutLines({ filePath: 'badFile' }, inputStream, formatTailOutput);
    inputStream.emit('error', { code: 'EISDIR' });
    assert.ok(formatTailOutput.calledWith({ errMsg, lastLines: '' }));
  });

  it('Should should give empty string if file is empty ', function() {
    const formatTailOutput = sinon.fake();
    const inputStream = new EventEmitter();
    loadAndCutLines(
      { filePath: 'a.txt', linesRequired: '10' },
      inputStream,
      formatTailOutput
    );
    inputStream.emit('data', '');
    inputStream.emit('end');
    assert.ok(formatTailOutput.calledWith({ lastLines: '', errMsg: '' }));
  });

  it('should give last 10 lines if data has more than 10 lines', () => {
    const formatTailOutput = sinon.fake();
    const lastLines = '3\n4\n5\n6\n7\n8\n9\n10\n11\n12';
    const inputStream = new EventEmitter();
    loadAndCutLines(
      { filePath: 'a.txt', linesRequired: '10' },
      inputStream,
      formatTailOutput
    );
    inputStream.emit('data', '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12');
    inputStream.emit('end');
    assert.ok(formatTailOutput.calledWith({ lastLines, errMsg: '' }));
  });

  it('should give whole lines if data has less than 10 lines', () => {
    const formatTailOutput = sinon.fake();
    const lastLines = '1\n2\n3\n4\n5';
    const inputStream = new EventEmitter();
    loadAndCutLines(
      { filePath: 'a.txt', linesRequired: '10' },
      inputStream,
      formatTailOutput
    );
    inputStream.emit('data', '1\n2\n3\n4\n5');
    inputStream.emit('end');
    assert.ok(formatTailOutput.calledWith({ lastLines, errMsg: '' }));
  });

  it('should give last 6 lines if data has more than given count', () => {
    const formatTailOutput = sinon.fake();
    const lastLines = '3\n4\n5\n6\n7\n8';
    const inputStream = new EventEmitter();
    loadAndCutLines(
      {
        filePath: 'a.txt',
        linesRequired: '6'
      },
      inputStream,
      formatTailOutput
    );
    inputStream.emit('data', '1\n2\n3\n4\n5\n6\n7\n8');
    inputStream.emit('end');
    assert.ok(formatTailOutput.calledWith({ lastLines, errMsg: '' }));
  });

  it('should give whole lines if data has less than given count', () => {
    const formatTailOutput = sinon.fake();
    const lastLines = '1\n2\n3\n4\n5';
    const inputStream = new EventEmitter();
    loadAndCutLines(
      { filePath: 'a.txt', linesRequired: '8' },
      inputStream,
      formatTailOutput
    );
    inputStream.emit('data', '1\n2\n3\n4\n5');
    inputStream.emit('end');
    assert.ok(formatTailOutput.calledWith({ lastLines, errMsg: '' }));
  });
});
