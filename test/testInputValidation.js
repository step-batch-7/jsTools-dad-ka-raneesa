'use strict';

const { validateUserOptions } = require('../src/inputValidation');
const assert = require('chai').assert;

describe('validateUserOptions', function() {
  it('Should give empty string if we give only file name', function() {
    assert.strictEqual(validateUserOptions(['a.txt']), '');
  });

  it("Should give empty string if we doesn't give anything", function() {
    assert.strictEqual(validateUserOptions(['']), '');
  });

  it('Should give empty string if we give valid offset and option', function() {
    assert.strictEqual(validateUserOptions(['-n', '6']), '');
  });

  it('Should give error if given offset is not valid', function() {
    const expected = `tail: illegal offset -- goodFile`;
    assert.strictEqual(validateUserOptions(['-n', 'goodFile']), expected);
  });

  it('Should give error if given option is not valid', function() {
    const expected = `tail: illegal option -- g\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]`;
    assert.strictEqual(validateUserOptions(['-g', 'goodFile']), expected);
  });

  it('Should give error if given option is not valid', function() {
    const expected = `tail: illegal option -- dg\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]`;
    assert.strictEqual(validateUserOptions(['-ndg', 'goodFile']), expected);
  });
});
