"use Strict";

const validateOffset = function(offset) {
  if (isNaN(+offset)) {
    return `tail: illegal offset -- ${offset}`;
  }
  return "";
};

const validateOptionAndOffset = function(option, offset) {
  if (!(option == "-n")) {
    let illegalOption = option.slice(1, 2);
    if (option.slice(0, 2) == "-n") {
      illegalOption = option.slice(2);
    }
    const usage = `usage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]`;
    const err = `tail: illegal option -- ${illegalOption}\n${usage}`;
    return err;
  }
  return validateOffset(offset);
};

const isAnOption = arg => {
  return arg[0] == "-" && arg.length > 1;
};

const validateUserOptions = function(userOptions) {
  const option = userOptions[0];
  if (isAnOption(option)) {
    return validateOptionAndOffset(option, userOptions[1]);
  }
  return "";
};

module.exports = { validateUserOptions };
