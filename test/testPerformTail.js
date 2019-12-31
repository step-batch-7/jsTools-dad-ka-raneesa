'use strict';

const sinon = require('sinon');
const assert = require('chai').assert;
const { EventEmitter } = require('events');
const { tail } = require('../src/performTail.js');

describe('tail', function() {
  it('Should give error if given option is not valid', function() {
    const usage = 'tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
    const expected = `tail: illegal option -- g\nusage: ${usage}`;
    const printEndResult = function({ error, lastLines }) {
      assert.deepStrictEqual(error, expected);
      assert.strictEqual(lastLines, '');
    };
    tail(['node', 'tail.js', '-g', 'goodFile'], {}, printEndResult);
  });

  it('Should give error if given option with offset is not valid', function() {
    const printEndResult = function({ error, lastLines }) {
      assert.deepStrictEqual(error, 'tail: illegal offset -- dg');
      assert.strictEqual(lastLines, '');
    };
    tail(['node', 'tail.js', '-ndg', 'goodFile'], {}, printEndResult);
  });

  it('should give error to callback if error event is occurred', function() {
    const printEndResult = function({ error, lastLines }) {
      assert.strictEqual(error, 'tail: badFile: No such file or directory');
      assert.strictEqual(lastLines, '');
    };
    const inputStream = new EventEmitter();
    const createReadStream = sinon.fake.returns(inputStream);
    tail(['node', 'tail.js', 'badFile'], createReadStream, printEndResult);
    inputStream.emit('error', { code: 'ENOENT' });
  });

  it('should give err if option is mentioned without the count', function() {
    const printEndResult = function({ error, lastLines }) {
      assert.deepStrictEqual(error, 'tail: illegal offset -- goodFile');
      assert.strictEqual(lastLines, '');
    };
    tail(['node', 'tail.js', '-n', 'goodFile'], '', printEndResult);
  });

  it('should give error if file is not readable', function() {
    const displayResult = function({ error, lastLines }) {
      assert.strictEqual(error, 'tail: sample.txt: Permission denied');
      assert.strictEqual(lastLines, '');
    };
    const inputStream = new EventEmitter();
    const createReadStream = sinon.fake.returns(inputStream);
    tail(['node', 'tail.js', 'sample.txt'], createReadStream, displayResult);
    inputStream.emit('error', { code: 'EACCES' });
  });

  it('Should should give empty string if file is empty ', function() {
    const printEndResult = function({ error, lastLines }) {
      assert.strictEqual(error, '');
      assert.strictEqual(lastLines, '');
    };
    const inputStream = new EventEmitter();
    const createReadStream = sinon.fake.returns(inputStream);
    tail(['node', 'tail.js', 'a.txt'], createReadStream, printEndResult);
    inputStream.emit('data', '');
  });

  it('should give last 10 lines if data has more than 10 lines', function() {
    const printEndResult = function({ error, lastLines }) {
      assert.strictEqual(error, '');
      assert.deepStrictEqual(lastLines, '3\n4\n5\n6\n7\n8\n9\n10\n11\n12');
    };
    const inputStream = new EventEmitter();
    const createReadStream = sinon.fake.returns(inputStream);
    tail(['node', 'tail.js', 'a.txt'], createReadStream, printEndResult);
    inputStream.emit('data', '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12');
  });

  it('should give whole lines if data has less than 10 lines', function() {
    const printEndResult = function({ error, lastLines }) {
      assert.strictEqual(error, '');
      assert.deepStrictEqual(lastLines, '1\n2\n3\n4\n5\n6');
    };
    const inputStream = new EventEmitter();
    const createReadStream = sinon.fake.returns(inputStream);
    tail(['node', 'tail.js', 'a.txt'], createReadStream, printEndResult);
    inputStream.emit('data', '1\n2\n3\n4\n5\n6');
  });

  it('should give last 6 lines if data has more than given count', function() {
    const printEndResult = function({ error, lastLines }) {
      assert.strictEqual(error, '');
      assert.strictEqual(lastLines, '7\n8\n9\n10\n11\n12');
    };
    const inputStream = new EventEmitter();
    const createReadStream = sinon.fake.returns(inputStream);
    tail(['node', 'tail.js', 'a.txt'], createReadStream, printEndResult);
    inputStream.emit('data', '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12');
  });

  it('should give whole lines if data has less than given count', function() {
    const printEndResult = function({ error, lastLines }) {
      assert.strictEqual(error, '');
      assert.strictEqual(lastLines, '1\n2\n3\n4');
    };
    const inputStream = new EventEmitter();
    const createReadStream = sinon.fake.returns(inputStream);
    tail(['node', 'tail.js', 'a.txt'], createReadStream, printEndResult);
    inputStream.emit('data', '1\n2\n3\n4');
  });
});
