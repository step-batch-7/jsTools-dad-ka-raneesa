'use strict';

const assert = require('chai').assert;
const {
  parseOffset,
  parseByCheck,
  parseUserOptions
} = require('../src/parseUserOptions');

describe('parseOffset', function() {
  it('Should give error if given argument is not a number', function() {
    assert.deepStrictEqual(parseOffset('hi'), {
      error: 'tail: illegal offset -- hi',
      linesRequired: ''
    });
  });

  it('should give the parsed number if given args is a number', function() {
    assert.deepStrictEqual(parseOffset('8'), { error: '', linesRequired: '8' });
  });
});

describe('parseByCheck', function() {
  it('should give error if option is combined with invalid offset', function() {
    assert.deepStrictEqual(parseByCheck(['-nsg', 'a.txt']), {
      error: 'tail: illegal offset -- sg',
      linesRequired: '',
      filePath: 'a.txt'
    });
  });

  it('should give error if separated offset is not a number', function() {
    assert.deepStrictEqual(parseByCheck(['-n', 'gsf', 'a.txt']), {
      error: 'tail: illegal offset -- gsf',
      linesRequired: '',
      filePath: 'a.txt'
    });
  });

  it('should give tail options if we give only offset and file', function() {
    assert.deepStrictEqual(parseByCheck(['8', 'a.txt']), {
      error: '',
      linesRequired: '8',
      filePath: 'a.txt'
    });
  });

  it('Should give tail options if offset is attached with option', function() {
    assert.deepStrictEqual(parseByCheck(['-n1', 'a.txt']), {
      error: '',
      linesRequired: '1',
      filePath: 'a.txt'
    });
  });

  it('should give tail options if option is separated from offset', function() {
    assert.deepStrictEqual(parseByCheck(['-n', '8', 'a.txt']), {
      error: '',
      linesRequired: '8',
      filePath: 'a.txt'
    });
  });
});

describe('parseUserOptions', function() {
  it('should give error if  invalid option is given ', function() {
    const usage = 'tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
    assert.deepStrictEqual(parseUserOptions(['-sg', '1', 'a.txt']), {
      error: `tail: illegal option -- sg\nusage: ${usage}`,
      linesRequired: '',
      filePath: ''
    });
  });

  it('should give tail options if options and offset are valid', function() {
    assert.deepStrictEqual(parseUserOptions(['-n', '-1', 'a.txt']), {
      error: '',
      linesRequired: '-1',
      filePath: 'a.txt'
    });
  });
});
