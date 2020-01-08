'use Strict';

const isOffsetSeparate = function(option) {
  const optionLength = 3;
  return option.length < optionLength && option.startsWith('-n');
};

const parseOffset = function(num) {
  if (isNaN(+num)) {
    return { error: `tail: illegal offset -- ${num}`, linesRequired: '' };
  }
  return { error: '', linesRequired: `${num}` };
};

const isOffsetAttached = function(option) {
  const optionLength = 2;
  return option.length > optionLength && option.startsWith('-n');
};

const parseByCheck = function(options) {
  const [option, offset, filePath] = options;
  if (isOffsetAttached(option)) {
    const [, , ...newOffset] = option;
    return { ...parseOffset(newOffset.join('')), filePath: offset };
  }
  if (isOffsetSeparate(option)) {
    return { ...parseOffset(offset), filePath };
  }
  return { ...parseOffset(option), filePath: offset };
};

const isACountOption = function(arg) {
  return arg.startsWith('-n') || Number.isInteger(+arg);
};

const isAnOption = function(arg) {
  const linesRequired = +arg;
  return (
    arg.startsWith('-') ||
    arg.startsWith('+') ||
    Number.isInteger(linesRequired)
  );
};

const parseOption = function(option) {
  const [, ...illegalOption] = option;
  const tailOptions = '[-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]';
  const usage = `usage: tail ${tailOptions}`;
  const error = `tail: illegal option -- ${illegalOption.join('')}\n${usage}`;
  return error;
};

const parseUserOptions = function(userOptions) {
  if (!userOptions.length) {
    return {
      error: '',
      filePath: '',
      linesRequired: 10
    };
  }
  const [option] = userOptions;
  if (!isAnOption(option)) {
    return { error: '', filePath: option, linesRequired: 10 };
  }
  if (!isACountOption(option)) {
    return { error: parseOption(option), filePath: '', linesRequired: '' };
  }
  return parseByCheck(userOptions);
};

module.exports = { parseOffset, parseByCheck, parseUserOptions };
