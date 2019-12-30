'use strict';

const assert = require('chai').assert;
const { filterUserOptions, loadFile, getLastLines } = require('../src/tailLib');

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

describe('loadFile', function() {
  it('Should give error if file not present', function() {
    const isFileExist = filePath => {
      return false;
    };
    const utils = { isFileExist };
    assert.deepStrictEqual(loadFile('a.txt', utils), {
      fileError: 'tail: a.txt: no such file or directory'
    });
  });

  it('Should give content of file if file present', function() {
    const isFileExist = filePath => {
      return true;
    };

    const reader = (filePath, encoding) => {
      return '1\n2\n3\n4\n5';
    };
    const utils = { isFileExist, reader, encoding: 'utf8' };
    assert.deepStrictEqual(loadFile('a.txt', utils), {
      fileContent: ['1', '2', '3', '4', '5']
    });
  });
});

describe('getLastLines', function() {
  it('should give last ten line of file content if lines are more than 10', function() {
    const fileContent = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12'
    ];
    let expected = '3\n4\n5\n6\n7\n8\n9\n10\n11\n12';
    assert.strictEqual(getLastLines(fileContent, 10), expected);
  });

  it('should give last total lines of file content if lines are less than 10', function() {
    const fileContent = ['1', '2', '3', '4', '5'];
    let expected = '1\n2\n3\n4\n5';
    assert.strictEqual(getLastLines(fileContent, 10), expected);
  });

  it('should give last given no of lines of file content if tail count is given', function() {
    let fileContent = ['1', '2', '3', '4', '5', '6', '7', '8'];
    let expected = '4\n5\n6\n7\n8';
    assert.strictEqual(getLastLines(fileContent, 5), expected);
  });
});
