'use strict';

const { tail } = require('../src/performTail.js');
const assert = require('chai').assert;

describe('tail', function() {
  it('Should give error if given option is not valid', function() {
    const expected = `tail: illegal option -- g\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]`;
    const printers = function({ error, lastLines }) {
      assert.deepStrictEqual(error, expected);
      assert.strictEqual(lastLines, '');
    };
    tail(['node', 'tail.js', '-g', 'goodFile'], {}, printers);
  });

  it('Should give error if given option is not valid', function() {
    const expected = `tail: illegal option -- dg\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]`;
    const printers = function({ error, lastLines }) {
      assert.deepStrictEqual(error, expected);
      assert.strictEqual(lastLines, '');
    };
    tail(['node', 'tail.js', '-ndg', 'goodFile'], {}, printers);
  });

  it('Should give error if file is not exist', function() {
    const isFileExist = filePath => {
      return false;
    };

    const printers = function({ error, lastLines }) {
      assert.deepStrictEqual(error, 'tail: a.txt: no such file or directory');
      assert.deepStrictEqual(lastLines, '');
    };

    tail(
      ['node', 'tail.js', 'a.txt'],
      {
        isFileExist
      },
      printers
    );
  });

  it('should give error message when only option is mentioned without the count', function() {
    const isFileExist = filePath => {
      return false;
    };
    const printers = function({ error, lastLines }) {
      assert.deepStrictEqual(error, 'tail: illegal offset -- goodFile');
      assert.strictEqual(lastLines, '');
    };

    tail(
      ['node', 'tail.js', '-n', 'goodFile'],
      {
        isFileExist
      },
      printers
    );
  });

  it('Should should give 10 last lines of a file if file has more than 10 lines ', function() {
    const reader = (filePath, encoding) => {
      return '3\n4\n5\n6\n7\n8\n9\n10\n11\n12';
    };
    const isFileExist = filePath => {
      return true;
    };
    const printers = function({ error, lastLines }) {
      assert.strictEqual(error, '');
      assert.deepStrictEqual(lastLines, '3\n4\n5\n6\n7\n8\n9\n10\n11\n12');
    };
    tail(
      ['node', 'tail.js', 'a.txt'],
      {
        isFileExist,
        reader
      },
      printers
    );
  });

  it('Should should give whole lines of a file if file has less than 10 lines ', function() {
    const reader = (filePath, encoding) => {
      return '1\n2\n3\n4\n5\n6';
    };
    const isFileExist = filePath => {
      return true;
    };
    const printers = function({ error, lastLines }) {
      assert.strictEqual(error, '');
      assert.deepStrictEqual(lastLines, '1\n2\n3\n4\n5\n6');
    };
    tail(
      ['node', 'tail.js', 'a.txt'],
      {
        isFileExist,
        reader
      },
      printers
    );
  });

  it('Should should give empty string if file is empty ', function() {
    const reader = (filePath, encoding) => {
      return '';
    };
    const isFileExist = filePath => {
      return true;
    };
    const printers = function({ error, lastLines }) {
      assert.strictEqual(error, '');
      assert.strictEqual(lastLines, '');
    };
    tail(
      ['node', 'tail.js', 'a.txt'],
      {
        isFileExist,
        reader
      },
      printers
    );
  });

  it('Should should give 6 last lines of a file if file has more than given 6 lines in command ', function() {
    const reader = (filePath, encoding) => {
      return '7\n8\n9\n10\n11\n12';
    };
    const isFileExist = filePath => {
      return true;
    };
    const printers = function({ error, lastLines }) {
      assert.strictEqual(error, '');
      assert.strictEqual(lastLines, '7\n8\n9\n10\n11\n12');
    };
    tail(
      ['node', 'tail.js', 'a.txt'],
      {
        isFileExist,
        reader
      },
      printers
    );
  });

  it('Should should give whole lines of a file if file has less than given 6 lines in command ', function() {
    const reader = filePath => {
      return '1\n2\n3\n4';
    };
    const isFileExist = filePath => {
      return true;
    };
    const printers = function({ error, lastLines }) {
      assert.strictEqual(error, '');
      assert.strictEqual(lastLines, '1\n2\n3\n4');
    };
    tail(
      ['node', 'tail.js', 'a.txt'],
      {
        isFileExist,
        reader
      },
      printers
    );
  });
});
