'use Strict';

const validateOffset = function(offset) {
  if (isNaN(+offset)) {
    return `tail: illegal offset -- ${offset}`;
  }
  return '';
};

const validateOptionAndOffset = function(args) {
  const { option, offset, startIndex, startRange, endRange } = args;
  if (!(option === '-n')) {
    let illegalOption = option.slice(startRange, endRange);
    if (option.slice(startIndex, endRange) === '-n') {
      illegalOption = option.slice(endRange);
    }
    const tailOptions = '[-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
    const usage = `usage: tail ${tailOptions}`;
    const err = `tail: illegal option -- ${illegalOption}\n${usage}`;
    return err;
  }
  return validateOffset(offset);
};

const isAnOption = (arg, startIndex, startRange) => {
  return arg[startIndex] === '-' && arg.length > startRange;
};

const validateUserOptions = function(userOptions) {
  const startIndex = 0;
  const startRange = 1;
  const endRange = 2;
  const option = userOptions[startIndex];
  if (isAnOption(option, startIndex, startRange)) {
    const offset = userOptions[startRange];
    const args = { option, offset, startIndex, startRange, endRange };
    return validateOptionAndOffset(args);
  }
  return '';
};

module.exports = { validateUserOptions };
