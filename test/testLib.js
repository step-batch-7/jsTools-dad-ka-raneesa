'use strict';
const { EventEmitter } = require('events');
const assert = require('chai').assert;
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
    const completeCallback = function({ errMsg, lastLines }) {
      assert.strictEqual(errMsg, 'tail: badFile: No such file or directory');
      assert.isUndefined(lastLines);
    };
    const inputStream = new EventEmitter();
    loadAndCutLines({ filePath: 'badFile' }, inputStream, completeCallback);
    inputStream.emit('error', { code: 'ENOENT' });
  });

  it('Should give error if file permission is denied', function() {
    const completeCallback = function({ errMsg, lastLines }) {
      assert.strictEqual(errMsg, 'tail: badFile: Permission denied');
      assert.isUndefined(lastLines);
    };
    const inputStream = new EventEmitter();
    loadAndCutLines({ filePath: 'badFile' }, inputStream, completeCallback);
    inputStream.emit('error', { code: 'EACCES' });
  });

  it('Should should give empty string if file is empty ', function() {
    const printEndResult = function({ error, lastLines }) {
      assert.strictEqual(error, '');
      assert.strictEqual(lastLines, '');
    };
    const inputStream = new EventEmitter();
    loadAndCutLines(
      { filePath: 'a.txt', linesRequired: '10' },
      inputStream,
      printEndResult
    );
    inputStream.emit('data', '');
  });

  it('should give last 10 lines if data has more than 10 lines', () => {
    const completeCallback = function({ errMsg, lastLines }) {
      assert.isUndefined(errMsg);
      assert.strictEqual(lastLines, '3\n4\n5\n6\n7\n8\n9\n10\n11\n12');
    };
    const inputStream = new EventEmitter();
    loadAndCutLines(
      { filePath: 'a.txt', linesRequired: '10' },
      inputStream,
      completeCallback
    );
    inputStream.emit('data', '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12');
    inputStream.emit('end');
  });

  it('should give whole lines if data has less than 10 lines', () => {
    const completeCallback = function({ errMsg, lastLines }) {
      assert.isUndefined(errMsg);
      assert.strictEqual(lastLines, '1\n2\n3\n4\n5');
    };
    const inputStream = new EventEmitter();
    loadAndCutLines(
      { filePath: 'a.txt', linesRequired: '10' },
      inputStream,
      completeCallback
    );
    inputStream.emit('data', '1\n2\n3\n4\n5');
    inputStream.emit('end');
  });

  it('should give last 6 lines if data has more than given count', () => {
    const completeCallback = function({ errMsg, lastLines }) {
      assert.isUndefined(errMsg);
      assert.strictEqual(lastLines, '3\n4\n5\n6\n7\n8');
    };
    const inputStream = new EventEmitter();
    loadAndCutLines(
      { filePath: 'a.txt', linesRequired: '6' },
      inputStream,
      completeCallback
    );
    inputStream.emit('data', '1\n2\n3\n4\n5\n6\n7\n8');
    inputStream.emit('end');
  });

  it('should give whole lines if data has less than given count', () => {
    const completeCallback = function({ errMsg, lastLines }) {
      assert.isUndefined(errMsg);
      assert.strictEqual(lastLines, '1\n2\n3\n4\n5');
    };
    const inputStream = new EventEmitter();
    loadAndCutLines(
      { filePath: 'a.txt', linesRequired: '8' },
      inputStream,
      completeCallback
    );
    inputStream.emit('data', '1\n2\n3\n4\n5');
    inputStream.emit('end');
  });
});
