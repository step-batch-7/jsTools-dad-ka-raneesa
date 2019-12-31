'use strict';

const sinon = require('sinon');
const assert = require('chai').assert;
const { EventEmitter } = require('events');
const { tail } = require('../src/performTail.js');

describe('tail', function() {
  it('Should give error if given option is not valid', function() {
    const usage = 'tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
    const expected = `tail: illegal option -- g\nusage: ${usage}`;
    const printEndResult = sinon.fake();
    tail(['node', 'tail.js', '-g', 'goodFile'], {}, printEndResult);
    assert.ok(printEndResult.calledWith({ error: expected, lastLines: '' }));
  });

  it('Should give error if given option with offset is not valid', function() {
    const error = 'tail: illegal offset -- dg';
    const printEndResult = sinon.fake();
    tail(['node', 'tail.js', '-ndg', 'goodFile'], {}, printEndResult);
    assert.ok(printEndResult.calledWith({ error, lastLines: '' }));
  });

  it('should give error to callback if error event is occurred', function() {
    const error = 'tail: badFile: No such file or directory';
    const printEndResult = sinon.fake();
    const inputStream = new EventEmitter();
    const createReadStream = sinon.fake.returns(inputStream);
    tail(['node', 'tail.js', 'badFile'], { createReadStream }, printEndResult);
    inputStream.emit('error', { code: 'ENOENT' });
    assert.ok(printEndResult.calledWith({ error, lastLines: '' }));
  });

  it('should give err if option is mentioned without the count', function() {
    const error = 'tail: illegal offset -- goodFile';
    const printEndResult = sinon.fake();
    tail(['node', 'tail.js', '-n', 'goodFile'], {}, printEndResult);
    assert.ok(printEndResult.calledWith({ error, lastLines: '' }));
  });

  it('should give error if file is not readable', function() {
    const error = 'tail: sample.txt: Permission denied';
    const printEndResult = sinon.fake();
    const inputStream = new EventEmitter();
    const createReadStream = sinon.fake.returns(inputStream);
    tail(
      ['node', 'tail.js', 'sample.txt'],
      { createReadStream },
      printEndResult
    );
    inputStream.emit('error', { code: 'EACCES' });
    assert.ok(printEndResult.calledWith({ error, lastLines: '' }));
  });

  describe('file is given', function() {
    it('Should should give empty string if file is empty ', function() {
      const printEndResult = sinon.fake();
      const inputStream = new EventEmitter();
      const createReadStream = sinon.fake.returns(inputStream);
      tail(['node', 'tail.js', 'a.txt'], { createReadStream }, printEndResult);
      inputStream.emit('data', '');
      inputStream.emit('end');
      assert.ok(printEndResult.calledWith({ error: '', lastLines: '' }));
    });

    it('should give last 10 lines if data has more than 10 lines', function() {
      const printEndResult = sinon.fake();
      const lastLines = '3\n4\n5\n6\n7\n8\n9\n10\n11\n12';
      const inputStream = new EventEmitter();
      const createReadStream = sinon.fake.returns(inputStream);
      tail(['node', 'tail.js', 'a.txt'], { createReadStream }, printEndResult);
      inputStream.emit('data', '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12');
      inputStream.emit('end');
      assert.ok(printEndResult.calledWith({ error: '', lastLines }));
    });

    it('should give whole lines if data has less than 10 lines', function() {
      const printEndResult = sinon.fake();
      const lastLines = '1\n2\n3\n4\n5\n6';
      const inputStream = new EventEmitter();
      const createReadStream = sinon.fake.returns(inputStream);
      tail(['node', 'tail.js', 'a.txt'], { createReadStream }, printEndResult);
      inputStream.emit('data', '1\n2\n3\n4\n5\n6');
      inputStream.emit('end');
      assert.ok(printEndResult.calledWith({ error: '', lastLines }));
    });

    it('should give last 6 lines if data has more than count', function() {
      const printEndResult = sinon.fake();
      const lastLines = '7\n8\n9\n10\n11\n12';
      const inputStream = new EventEmitter();
      const createReadStream = sinon.fake.returns(inputStream);
      tail(
        ['node', 'tail.js', '-n', '6', 'a.txt'],
        { createReadStream },
        printEndResult
      );
      inputStream.emit('data', '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12');
      inputStream.emit('end');
      assert.ok(printEndResult.calledWith({ error: '', lastLines }));
    });

    it('should give whole lines if data has less than given count', function() {
      const printEndResult = sinon.fake();
      const lastLines = '1\n2\n3\n4';
      const inputStream = new EventEmitter();
      const createReadStream = sinon.fake.returns(inputStream);
      tail(
        ['node', 'tail.js', '-n', '6', 'a.txt'],
        { createReadStream },
        printEndResult
      );
      inputStream.emit('data', '1\n2\n3\n4');
      inputStream.emit('end');
      assert.ok(printEndResult.calledWith({ error: '', lastLines }));
    });

    it('should give last 6 lines if option and offset is attached', function() {
      const printEndResult = sinon.fake();
      const lastLines = '7\n8\n9\n10\n11\n12';
      const inputStream = new EventEmitter();
      const createReadStream = sinon.fake.returns(inputStream);
      tail(
        ['node', 'tail.js', '-n6', 'a.txt'],
        { createReadStream },
        printEndResult
      );
      inputStream.emit('data', '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12');
      inputStream.emit('end');
      assert.ok(printEndResult.calledWith({ error: '', lastLines }));
    });
  });

  describe('stdin is given', function() {
    it('Should should give empty string if stdin is empty ', function() {
      const printEndResult = sinon.fake();
      const stdin = new EventEmitter();
      tail(['node', 'tail.js'], { stdin }, printEndResult);
      stdin.emit('data', '');
      stdin.emit('end');
      assert.ok(printEndResult.calledWith({ error: '', lastLines: '' }));
    });

    it('should give last 10 lines if stdin has more than 10 lines', function() {
      const printEndResult = sinon.fake();
      const lastLines = '3\n4\n5\n6\n7\n8\n9\n10\n11\n12';
      const stdin = new EventEmitter();
      tail(['node', 'tail.js'], { stdin }, printEndResult);
      stdin.emit('data', '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12');
      stdin.emit('end');
      assert.ok(printEndResult.calledWith({ error: '', lastLines }));
    });

    it('should give whole lines if stdin has less than 10 lines', function() {
      const printEndResult = sinon.fake();
      const lastLines = '1\n2\n3\n4\n5\n6';
      const stdin = new EventEmitter();
      tail(['node', 'tail.js'], { stdin }, printEndResult);
      stdin.emit('data', '1\n2\n3\n4\n5\n6');
      stdin.emit('end');
      assert.ok(printEndResult.calledWith({ error: '', lastLines }));
    });

    it('should give last 6 lines if stdin has more than count', function() {
      const printEndResult = sinon.fake();
      const lastLines = '7\n8\n9\n10\n11\n12';
      const stdin = new EventEmitter();
      tail(['node', 'tail.js', '-n', '6'], { stdin }, printEndResult);
      stdin.emit('data', '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12');
      stdin.emit('end');
      assert.ok(printEndResult.calledWith({ error: '', lastLines }));
    });

    it('should give whole lines if stdin has less than count', function() {
      const printEndResult = sinon.fake();
      const lastLines = '1\n2\n3\n4';
      const stdin = new EventEmitter();
      tail(['node', 'tail.js', '-n', '6'], { stdin }, printEndResult);
      stdin.emit('data', '1\n2\n3\n4');
      stdin.emit('end');
      assert.ok(printEndResult.calledWith({ error: '', lastLines }));
    });
  });
});
