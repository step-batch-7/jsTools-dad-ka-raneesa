'use strict';

const sinon = require('sinon');
const assert = require('chai').assert;
const {readStream} = require('../src/streamReader');

describe('readContent', () => {
  it('should return content given through readStream', (done) => {
    const onReadComplete = function({content, errMsg}) {
      assert.strictEqual(content, 'a\nc\nb');
      assert.strictEqual(errMsg, '');
      done();
    };
    const inputStream = {};
    inputStream.on = sinon.stub();
    inputStream.on.withArgs('data').yields('a\nc\nb');
    inputStream.on.withArgs('end').yields();
    readStream(inputStream, onReadComplete);
  });

  it('should return ENOENT error given through readStream', (done) => {
    const formatTailLines = function({errMsg, content}) {
      assert.strictEqual(errMsg, 'No such file or directory');
      assert.strictEqual(content, '');
      done();
    };
    const inputStream = {};
    inputStream.on = sinon.stub();
    inputStream.on.withArgs('error').yields({code: 'ENOENT'});
    readStream(inputStream, formatTailLines);
  });

  it('should return EACCES error given through readStream', (done) => {
    const formatTailLines = function({errMsg, content}) {
      assert.strictEqual(errMsg, 'Permission denied');
      assert.strictEqual(content, '');
      done();
    };
    const inputStream = {};
    inputStream.on = sinon.stub();
    inputStream.on.withArgs('error').yields({code: 'EACCES'});
    readStream(inputStream, formatTailLines);
  });

  it('should return EISDIR error given through readStream', (done) => {
    const formatTailLines = function({errMsg, content}) {
      assert.strictEqual(errMsg, '');
      assert.strictEqual(content, '');
      done();
    };
    const inputStream = {};
    inputStream.on = sinon.stub();
    inputStream.on.withArgs('error').yields({code: 'EISDIR'});
    readStream(inputStream, formatTailLines);
  });

  it('should return content given through stdin', (done) => {
    const formatTailLines = function({errMsg, content}) {
      assert.strictEqual(content, 'a\nc\nb');
      assert.strictEqual(errMsg, '');
      done();
    };
    const inputStream = {};
    inputStream.on = sinon.stub();
    inputStream.on.withArgs('data').yields('a\nc\nb');
    inputStream.on.withArgs('end').yields();
    readStream(inputStream, formatTailLines);
  });
});
