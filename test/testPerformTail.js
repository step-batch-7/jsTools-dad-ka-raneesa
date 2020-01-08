'use strict';

const sinon = require('sinon');
const assert = require('chai').assert;
const { tail } = require('../src/performTail.js');

describe('tail', function() {
  let onCompletion;
  const inputStream = {};
  beforeEach(function() {
    inputStream.on = sinon.stub();
    onCompletion = sinon.fake();
  });
  context('option errors are present', () => {
    it('Should give error if given option is not valid', function() {
      const usage = 'tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
      const expected = `tail: illegal option -- g\nusage: ${usage}`;
      tail(['node', 'tail.js', '-g', 'goodFile'], {}, onCompletion);
      assert.ok(onCompletion.calledWith({ error: expected, lastLines: '' }));
    });

    it('Should give err if given option with offset is not valid', function() {
      const error = 'tail: illegal offset -- dg';
      tail(['node', 'tail.js', '-ndg', 'goodFile'], {}, onCompletion);
      assert.ok(onCompletion.calledWith({ error, lastLines: '' }));
    });

    it('should give err if option is mentioned without the count', function() {
      const error = 'tail: illegal offset -- goodFile';
      tail(['node', 'tail.js', '-n', 'goodFile'], {}, onCompletion);
      assert.ok(onCompletion.calledWith({ error, lastLines: '' }));
    });

    it('should return error if file error event is occurred', function() {
      const createReadStream = () => inputStream;
      inputStream.on.withArgs('error').yields({ code: 'ENOENT' });
      tail(['node', 'tail.js', 'badFile'], { createReadStream }, onCompletion);
      sinon.assert.called(inputStream.on);
      const error = 'tail: badFile: No such file or directory';
      const expected = { error, lastLines: '' };
      assert.ok(onCompletion.calledOnceWithExactly(expected));
    });

    it('should return error if file not readable', function() {
      const createReadStream = () => inputStream;
      inputStream.on.withArgs('error').yields({ code: 'EACCES' });
      tail(['node', 'tail.js', 'sample.txt'], { createReadStream }, onCompletion);
      sinon.assert.called(inputStream.on);
      const error = 'tail: sample.txt: Permission denied';
      const expected = { error, lastLines: '' };
      assert.ok(onCompletion.calledOnceWithExactly(expected));
    });

    it('should return error as empty string if dir only given', function() {
      const createReadStream = () => inputStream;
      inputStream.on.withArgs('error').yields({ code: 'EISDIR' });
      tail(['node', 'tail.js', 'docs'], { createReadStream }, onCompletion);
      sinon.assert.called(inputStream.on);
      const expected = { error: '', lastLines: '' };
      assert.ok(onCompletion.calledOnceWithExactly(expected));
    });

    context('file is given', function() {
      it('Should give empty string if file is empty', function() {
        const createReadStream = () => inputStream;
        inputStream.on.withArgs('data').yields('');
        inputStream.on.withArgs('end').yields();
        tail(['node', 'tail.js', 'a.txt'], { createReadStream }, onCompletion);
        sinon.assert.called(inputStream.on);
        const expected = { error: '', lastLines: '' };
        assert.ok(onCompletion.calledOnceWithExactly(expected));
      });

      it('should give last 10lines if data has more than 10 lines', function() {
        const createReadStream = () => inputStream;
        const lines = '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11';
        inputStream.on.withArgs('data').yields(lines);
        inputStream.on.withArgs('end').yields();
        tail(['node', 'tail.js', 'a.txt'], { createReadStream }, onCompletion);
        sinon.assert.called(inputStream.on);
        const lastLines = '2\n3\n4\n5\n6\n7\n8\n9\n10\n11';
        const expected = { error: '', lastLines };
        assert.ok(onCompletion.calledOnceWithExactly(expected));
      });

      it('should give whole lines if data has less than 10 lines', function() {
        const createReadStream = () => inputStream;
        inputStream.on.withArgs('data').yields('1\n2\n3\n4\n5\n6');
        inputStream.on.withArgs('end').yields();
        tail(['node', 'tail.js', 'a.txt'], { createReadStream }, onCompletion);
        sinon.assert.called(inputStream.on);
        const expected = { error: '', lastLines: '1\n2\n3\n4\n5\n6' };
        assert.ok(onCompletion.calledOnceWithExactly(expected));
      });

      it('should give last 6 lines if data has more than count', function() {
        const createReadStream = () => inputStream;
        const lines = '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11';
        inputStream.on.withArgs('data').yields(lines);
        inputStream.on.withArgs('end').yields();
        const cmdArgs = ['node', 'tail.js', '-n', '6', 'a.txt'];
        tail(cmdArgs, { createReadStream }, onCompletion);
        sinon.assert.called(inputStream.on);
        const expected = { error: '', lastLines: '6\n7\n8\n9\n10\n11' };
        assert.ok(onCompletion.calledOnceWithExactly(expected));
      });

      it('should give whole lines if data has less than count', function() {
        const createReadStream = () => inputStream;
        inputStream.on.withArgs('data').yields('1\n2\n3\n4');
        inputStream.on.withArgs('end').yields();
        const cmdArgs = ['node', 'tail.js', '-n', '6', 'a.txt'];
        tail(cmdArgs, { createReadStream }, onCompletion);
        sinon.assert.called(inputStream.on);
        const expected = { error: '', lastLines: '1\n2\n3\n4' };
        assert.ok(onCompletion.calledOnceWithExactly(expected));
      });

      it('should give last 6 lines if option and offset attached', function() {
        const createReadStream = () => inputStream;
        const lines = '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11';
        inputStream.on.withArgs('data').yields(lines);
        inputStream.on.withArgs('end').yields();
        const cmdArgs = ['node', 'tail.js', '-n6', 'a.txt'];
        tail(cmdArgs, { createReadStream }, onCompletion);
        sinon.assert.called(inputStream.on);
        const expected = { error: '', lastLines: '6\n7\n8\n9\n10\n11' };
        assert.ok(onCompletion.calledOnceWithExactly(expected));
      });
    });

    context('stdin is given', function() {
      it('Should give empty string if stdin is empty', function() {
        const createStdinStream = () => inputStream;
        inputStream.on.withArgs('data').yields('');
        inputStream.on.withArgs('end').yields();
        tail(['node', 'tail.js'], { createStdinStream }, onCompletion);
        sinon.assert.called(inputStream.on);
        const expected = { error: '', lastLines: '' };
        assert.ok(onCompletion.calledOnceWithExactly(expected));
      });

      it('should give last 10lines if stdin has more than 10lines', function() {
        const createStdinStream = () => inputStream;
        const lines = '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11';
        inputStream.on.withArgs('data').yields(lines);
        inputStream.on.withArgs('end').yields();
        tail(['node', 'tail.js'], { createStdinStream }, onCompletion);
        sinon.assert.called(inputStream.on);
        const lastLines = '2\n3\n4\n5\n6\n7\n8\n9\n10\n11';
        const expected = { error: '', lastLines };
        assert.ok(onCompletion.calledOnceWithExactly(expected));
      });

      it('should give whole lines if stdin has less than 10 lines', function() {
        const createStdinStream = () => inputStream;
        inputStream.on.withArgs('data').yields('1\n2\n3\n4\n5\n6');
        inputStream.on.withArgs('end').yields();
        tail(['node', 'tail.js'], { createStdinStream }, onCompletion);
        sinon.assert.called(inputStream.on);
        const expected = { error: '', lastLines: '1\n2\n3\n4\n5\n6' };
        assert.ok(onCompletion.calledOnceWithExactly(expected));
      });

      it('should give last 6 lines if stdin has more than count', function() {
        const createStdinStream = () => inputStream;
        const lines = '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11';
        inputStream.on.withArgs('data').yields(lines);
        inputStream.on.withArgs('end').yields();
        const cmdArgs = ['node', 'tail.js', '-n', '6'];
        tail(cmdArgs, { createStdinStream }, onCompletion);
        sinon.assert.called(inputStream.on);
        const expected = { error: '', lastLines: '6\n7\n8\n9\n10\n11' };
        assert.ok(onCompletion.calledOnceWithExactly(expected));
      });

      it('should give whole lines if stdin has less than count', function() {
        const createStdinStream = () => inputStream;
        inputStream.on.withArgs('data').yields('1\n2\n3\n4');
        inputStream.on.withArgs('end').yields();
        const cmdArgs = ['node', 'tail.js', '-n', '6'];
        tail(cmdArgs, { createStdinStream }, onCompletion);
        sinon.assert.called(inputStream.on);
        const expected = { error: '', lastLines: '1\n2\n3\n4' };
        assert.ok(onCompletion.calledOnceWithExactly(expected));
      });

      it('should give last 6 lines if option and offset attached', function() {
        const createStdinStream = () => inputStream;
        const lines = '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11';
        inputStream.on.withArgs('data').yields(lines);
        inputStream.on.withArgs('end').yields();
        const cmdArgs = ['node', 'tail.js', '-n6'];
        tail(cmdArgs, { createStdinStream }, onCompletion);
        sinon.assert.called(inputStream.on);
        const expected = { error: '', lastLines: '6\n7\n8\n9\n10\n11' };
        assert.ok(onCompletion.calledOnceWithExactly(expected));
      });
    });
  });
});
