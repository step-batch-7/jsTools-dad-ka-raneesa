'use strict';
const assert = require('chai').assert;
const {
  filterUserOptions,
  getLastLines
} = require('../src/tailLib');

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

describe('getLastLines', function() {
  it('should give last 10 lines if data has more than 10 lines', function() {
    const linesRequired = 10;
    const content = '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12';
    const expected = '3\n4\n5\n6\n7\n8\n9\n10\n11\n12';
    assert.strictEqual(getLastLines(linesRequired, content), expected);
  });

  it('should give whole lines if data has less than 10 lines', function() {
    const linesRequired = 10;
    const content = '1\n2\n3\n4\n5';
    const expected = '1\n2\n3\n4\n5';
    assert.strictEqual(getLastLines(linesRequired, content), expected);
  });

  it('should give last 6 lines if data has more than given count', function() {
    const content = '1\n2\n3\n4\n5\n6\n7\n8';
    const linesRequired = 6;
    const expected = '3\n4\n5\n6\n7\n8';
    assert.strictEqual(getLastLines(linesRequired, content), expected);
  });

  it('should give whole lines if data has less than given count', function() {
    const content = '1\n2\n3\n4\n5\n6';
    const linesRequired = 8;
    const expected = '1\n2\n3\n4\n5\n6';
    assert.strictEqual(getLastLines(linesRequired, content), expected);
  });
});
