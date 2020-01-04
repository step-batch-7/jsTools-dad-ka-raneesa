'use strict';

const filterUserOptions = function(cmdArgs) {
  const [, , ...userOptions] = [...cmdArgs];
  return userOptions;
};

const getLastLines = function(linesRequired, content) {
  const count = Math.abs(linesRequired);
  const lines = content.split('\n');
  const slicedLines = lines.slice(-count).join('\n');
  return slicedLines;
};

module.exports = {
  filterUserOptions,
  getLastLines
};
