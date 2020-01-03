'use strict';

const sinon = require('sinon');
const assert = require('chai').assert;
const {tail} = require('../src/performTail.js');

describe('tail', function() {
  let onCompletion, inputStream;
  beforeEach(function() {
    inputStream = {setEncoding: sinon.fake(), on: sinon.fake()};
    onCompletion = sinon.fake();
  });
  context('option errors are present', () => {
    it('Should give error if given option is not valid', function() {
      const usage = 'tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
      const expected = `tail: illegal option -- g\nusage: ${usage}`;
      tail(['node', 'tail.js', '-g', 'goodFile'], {}, onCompletion);
      assert.ok(onCompletion.calledWith({error: expected, lastLines: ''}));
    });

    it('Should give err if given option with offset is not valid', function() {
      const error = 'tail: illegal offset -- dg';
      tail(['node', 'tail.js', '-ndg', 'goodFile'], {}, onCompletion);
      assert.ok(onCompletion.calledWith({error, lastLines: ''}));
    });

    it('should give error to callback if error event is occurred', function() {
      const error = 'tail: badFile: No such file or directory';
      const createReadStream = sinon.fake.returns(inputStream);
      tail(['node', 'tail.js', 'badFile'], {createReadStream}, onCompletion);
      assert(inputStream.setEncoding.calledWith('utf8'));
      assert.strictEqual(inputStream.on.firstCall.args[0], 'error');
      inputStream.on.firstCall.args[1]({code: 'ENOENT'});
      inputStream.on.secondCall.args[1]();
      assert.ok(onCompletion.calledWith({error, lastLines: ''}));
    });

    it('should give err if option is mentioned without the count', function() {
      const error = 'tail: illegal offset -- goodFile';
      tail(['node', 'tail.js', '-n', 'goodFile'], {}, onCompletion);
      assert.ok(onCompletion.calledWith({error, lastLines: ''}));
    });

    it('should give error if file is not readable', function() {
      const error = 'tail: sample.txt: Permission denied';
      const createReadStream = sinon.fake.returns(inputStream);
      tail(
        ['node', 'tail.js', 'sample.txt'],
        {createReadStream},
        onCompletion
      );
      assert(inputStream.setEncoding.calledWith('utf8'));
      assert.strictEqual(inputStream.on.firstCall.args[0], 'error');
      inputStream.on.firstCall.args[1]({code: 'EACCES'});
      inputStream.on.secondCall.args[1]();
      assert.ok(onCompletion.calledWith({error, lastLines: ''}));
    });
  });

  context('file is given', function() {
    it('Should should give empty string if file is empty ', function() {
      const createReadStream = sinon.fake.returns(inputStream);
      tail(['node', 'tail.js', 'a.txt'], {createReadStream}, onCompletion);
      assert(inputStream.setEncoding.calledWith('utf8'));
      assert.strictEqual(inputStream.on.firstCall.args[0], 'error');
      inputStream.on.firstCall.args[1]('');
      inputStream.on.secondCall.args[1]();
      assert.ok(onCompletion.calledWith({error: '', lastLines: ''}));
    });

    it('should give last 10 lines if data has more than 10 lines', function() {
      const lastLines = '2\n3\n4\n5\n6\n7\n8\n9\n10\n11';
      const createReadStream = sinon.fake.returns(inputStream);
      tail(['node', 'tail.js', 'a.txt'], {createReadStream}, onCompletion);
      assert(inputStream.setEncoding.calledWith('utf8'));
      assert.strictEqual(inputStream.on.secondCall.args[0], 'data');
      assert.strictEqual(inputStream.on.thirdCall.args[0], 'end');
      inputStream.on.secondCall.args[1]('1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11');
      inputStream.on.thirdCall.args[1]();
      assert.ok(onCompletion.calledWith({error: '', lastLines}));
    });

    it('should give whole lines if data has less than 10 lines', function() {
      const lastLines = '1\n2\n3\n4\n5\n6';
      const createReadStream = sinon.fake.returns(inputStream);
      tail(['node', 'tail.js', 'a.txt'], {createReadStream}, onCompletion);
      assert(inputStream.setEncoding.calledWith('utf8'));
      assert.strictEqual(inputStream.on.secondCall.args[0], 'data');
      assert.strictEqual(inputStream.on.thirdCall.args[0], 'end');
      inputStream.on.secondCall.args[1]('1\n2\n3\n4\n5\n6');
      inputStream.on.thirdCall.args[1]();
      assert.ok(onCompletion.calledWith({error: '', lastLines}));
    });

    it('should give last 6 lines if data has more than count', function() {
      const lastLines = '6\n7\n8\n9\n10\n11';
      const createReadStream = sinon.fake.returns(inputStream);
      tail(
        ['node', 'tail.js', '-n', '6', 'a.txt'],
        {createReadStream},
        onCompletion
      );
      assert(inputStream.setEncoding.calledWith('utf8'));
      assert.strictEqual(inputStream.on.secondCall.args[0], 'data');
      assert.strictEqual(inputStream.on.thirdCall.args[0], 'end');
      inputStream.on.secondCall.args[1]('1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11');
      inputStream.on.thirdCall.args[1]();
      assert.ok(onCompletion.calledWith({error: '', lastLines}));
    });

    it('should give whole lines if data has less than given count', function() {
      const lastLines = '1\n2\n3\n4';
      const createReadStream = sinon.fake.returns(inputStream);
      tail(
        ['node', 'tail.js', '-n', '6', 'a.txt'],
        {createReadStream},
        onCompletion
      );
      assert(inputStream.setEncoding.calledWith('utf8'));
      assert.strictEqual(inputStream.on.secondCall.args[0], 'data');
      assert.strictEqual(inputStream.on.thirdCall.args[0], 'end');
      inputStream.on.secondCall.args[1]('1\n2\n3\n4');
      inputStream.on.thirdCall.args[1]();
      assert.ok(onCompletion.calledWith({error: '', lastLines}));
    });

    it('should give last 6 lines if option and offset is attached', function() {
      const lastLines = '6\n7\n8\n9\n10\n11';
      const createReadStream = sinon.fake.returns(inputStream);
      tail(
        ['node', 'tail.js', '-n6', 'a.txt'],
        {createReadStream},
        onCompletion
      );
      assert(inputStream.setEncoding.calledWith('utf8'));
      assert.strictEqual(inputStream.on.secondCall.args[0], 'data');
      assert.strictEqual(inputStream.on.thirdCall.args[0], 'end');
      inputStream.on.secondCall.args[1]('1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11');
      inputStream.on.thirdCall.args[1]();
      assert.ok(onCompletion.calledWith({error: '', lastLines}));
    });
  });

  context('stdin is given', function() {
    let onCompletion, stdin;
    beforeEach(function() {
      stdin = {setEncoding: sinon.fake(), on: sinon.fake()};
      onCompletion = sinon.fake();
    });
    it('Should should give empty string if stdin is empty ', function() {
      const createStdinStream = sinon.fake.returns(stdin);
      tail(['node', 'tail.js'], {createStdinStream}, onCompletion);
      assert(stdin.setEncoding.calledWith('utf8'));
      assert.strictEqual(stdin.on.secondCall.args[0], 'data');
      assert.strictEqual(stdin.on.thirdCall.args[0], 'end');
      stdin.on.secondCall.args[1]('');
      stdin.on.thirdCall.args[1]();
      assert.ok(onCompletion.calledWith({error: '', lastLines: ''}));
    });

    it('should give last 10 lines if stdin has more than 10 lines', function() {
      const lastLines = '3\n4\n5\n6\n7\n8\n9\n10\n11\n12';
      const createStdinStream = sinon.fake.returns(stdin);
      tail(['node', 'tail.js'], {createStdinStream}, onCompletion);
      assert(stdin.setEncoding.calledWith('utf8'));
      assert.strictEqual(stdin.on.secondCall.args[0], 'data');
      assert.strictEqual(stdin.on.thirdCall.args[0], 'end');
      stdin.on.secondCall.args[1]('1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12');
      stdin.on.thirdCall.args[1]();
      assert.ok(onCompletion.calledWith({error: '', lastLines}));
    });

    it('should give whole lines if stdin has less than 10 lines', function() {
      const lastLines = '1\n2\n3\n4\n5\n6';
      const createStdinStream = sinon.fake.returns(stdin);
      tail(['node', 'tail.js'], {createStdinStream}, onCompletion);
      assert(stdin.setEncoding.calledWith('utf8'));
      assert.strictEqual(stdin.on.secondCall.args[0], 'data');
      assert.strictEqual(stdin.on.thirdCall.args[0], 'end');
      stdin.on.secondCall.args[1]('1\n2\n3\n4\n5\n6');
      stdin.on.thirdCall.args[1]();
      assert.ok(onCompletion.calledWith({error: '', lastLines}));
    });

    it('should give last 6 lines if stdin has more than count', function() {
      const lastLines = '7\n8\n9\n10\n11\n12';
      const createStdinStream = sinon.fake.returns(stdin);
      tail(
        ['node', 'tail.js', '-n', '6'],
        {createStdinStream},
        onCompletion
      );
      assert(stdin.setEncoding.calledWith('utf8'));
      assert.strictEqual(stdin.on.secondCall.args[0], 'data');
      assert.strictEqual(stdin.on.thirdCall.args[0], 'end');
      stdin.on.secondCall.args[1]('1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12');
      stdin.on.thirdCall.args[1]();
      assert.ok(onCompletion.calledWith({error: '', lastLines}));
    });

    it('should give whole lines if stdin has less than count', function() {
      const lastLines = '1\n2\n3\n4';
      const createStdinStream = sinon.fake.returns(stdin);
      tail(
        ['node', 'tail.js', '-n', '6'],
        {createStdinStream},
        onCompletion
      );
      assert(stdin.setEncoding.calledWith('utf8'));
      assert.strictEqual(stdin.on.secondCall.args[0], 'data');
      assert.strictEqual(stdin.on.thirdCall.args[0], 'end');
      stdin.on.secondCall.args[1]('1\n2\n3\n4');
      stdin.on.thirdCall.args[1]();
      assert.ok(onCompletion.calledWith({error: '', lastLines}));
    });
  });
});
