"use strict";

const { tail } = require("../src/performTail.js");
const {
  filterUserOptions,
  parseUserOptions,
  loadFile,
  getLastLines
} = require("../src/tailLib");

const assert = require("chai").assert;

describe("filterUserOptions", function() {
  it("Should give file name in an array", function() {
    const actual = filterUserOptions(["node", "tail.js", "a.txt"]);
    assert.deepStrictEqual(actual, ["a.txt"]);
  });

  it("Should give no of line and file name an array", function() {
    const actual = filterUserOptions(["node", "tail.js", "-n", "8", "a.txt"]);
    assert.deepStrictEqual(actual, ["-n", "8", "a.txt"]);
  });
});

describe("parseUserOptions", function() {
  it("Should give file name in object", function() {
    const actual = parseUserOptions(["a.txt"]);
    const expected = { noOfLines: 10, filePath: "a.txt" };
    assert.deepStrictEqual(actual, expected);
  });

  it("Should give no of line and file name in object", function() {
    const actual = parseUserOptions(["-n", "8", "a.txt"]);
    const expected = { noOfLines: "8", filePath: "a.txt" };
    assert.deepStrictEqual(actual, expected);
  });

  it("Should give error if we give string instead of count", function() {
    const actual = parseUserOptions(["-n", "a.txt"]);
    const expected = { inputError: `tail: illegal offset -- a.txt` };
    assert.deepStrictEqual(actual, expected);
  });
});

describe("loadFile", function() {
  it("Should give error if file not present", function() {
    const isFileExist = filePath => {
      return false;
    };
    const utils = { isFileExist };
    assert.deepStrictEqual(loadFile("a.txt", utils), {
      fileError: `tail: a.txt: no such file or directory`
    });
  });

  it("Should give content of file if file present", function() {
    const isFileExist = filePath => {
      return true;
    };

    const reader = (filePath, encoding) => {
      return "1\n2\n3\n4\n5";
    };
    const utils = { isFileExist, reader, encoding: "utf8" };
    assert.deepStrictEqual(loadFile("a.txt", utils), {
      fileContent: ["1", "2", "3", "4", "5"]
    });
  });
});

describe("getLastLines", function() {
  it("should give last ten line of file content if lines are more than 10", function() {
    const fileContent = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12"
    ];
    let expected = "3\n4\n5\n6\n7\n8\n9\n10\n11\n12";
    assert.strictEqual(getLastLines(fileContent, 10), expected);
  });

  it("should give last total lines of file content if lines are less than 10", function() {
    const fileContent = ["1", "2", "3", "4", "5"];
    let expected = "1\n2\n3\n4\n5";
    assert.strictEqual(getLastLines(fileContent, 10), expected);
  });

  it("should give last given no of lines of file content if tail count is given", function() {
    let fileContent = ["1", "2", "3", "4", "5", "6", "7", "8"];
    let expected = "4\n5\n6\n7\n8";
    assert.strictEqual(getLastLines(fileContent, 5), expected);
  });
});

describe("tail", function() {
  it("Should give error if file is not exist", function() {
    const isFileExist = filePath => {
      return false;
    };

    const printers = function({ error, lastLines }) {
      assert.deepStrictEqual(error, "tail: a.txt: no such file or directory");
      assert.deepStrictEqual(lastLines, "");
    };

    tail(
      ["node", "tail.js", "a.txt"],
      {
        isFileExist
      },
      printers
    );
  });

  it("should give error message when only option is mentioned without the count", function() {
    const isFileExist = filePath => {
      return false;
    };
    const printers = function({ error, lastLines }) {
      assert.deepStrictEqual(error, "tail: illegal offset -- goodFile");
      assert.strictEqual(lastLines, "");
    };

    tail(
      ["node", "tail.js", "-n", "goodFile"],
      {
        isFileExist
      },
      printers
    );
  });

  it("Should should give 10 last lines of a file if file has more than 10 lines ", function() {
    const reader = (filePath, encoding) => {
      return "3\n4\n5\n6\n7\n8\n9\n10\n11\n12";
    };
    const isFileExist = filePath => {
      return true;
    };
    const printers = function({ error, lastLines }) {
      assert.strictEqual(error, "");
      assert.deepStrictEqual(lastLines, "3\n4\n5\n6\n7\n8\n9\n10\n11\n12");
    };
    tail(
      ["node", "tail.js", "a.txt"],
      {
        isFileExist,
        reader
      },
      printers
    );
  });

  it("Should should give whole lines of a file if file has less than 10 lines ", function() {
    const reader = (filePath, encoding) => {
      return "1\n2\n3\n4\n5\n6";
    };
    const isFileExist = filePath => {
      return true;
    };
    const printers = function({ error, lastLines }) {
      assert.strictEqual(error, "");
      assert.deepStrictEqual(lastLines, "1\n2\n3\n4\n5\n6");
    };
    tail(
      ["node", "tail.js", "a.txt"],
      {
        isFileExist,
        reader
      },
      printers
    );
  });

  it("Should should give empty string if file is empty ", function() {
    const reader = (filePath, encoding) => {
      return "";
    };
    const isFileExist = filePath => {
      return true;
    };
    const printers = function({ error, lastLines }) {
      assert.strictEqual(error, "");
      assert.strictEqual(lastLines, "");
    };
    tail(
      ["node", "tail.js", "a.txt"],
      {
        isFileExist,
        reader
      },
      printers
    );
  });

  it("Should should give 6 last lines of a file if file has more than given 6 lines in command ", function() {
    const reader = (filePath, encoding) => {
      return "7\n8\n9\n10\n11\n12";
    };
    const isFileExist = filePath => {
      return true;
    };
    const printers = function({ error, lastLines }) {
      assert.strictEqual(error, "");
      assert.strictEqual(lastLines, "7\n8\n9\n10\n11\n12");
    };
    tail(
      ["node", "tail.js", "a.txt"],
      {
        isFileExist,
        reader
      },
      printers
    );
  });

  it("Should should give whole lines of a file if file has less than given 6 lines in command ", function() {
    const reader = filePath => {
      return "1\n2\n3\n4";
    };
    const isFileExist = filePath => {
      return true;
    };
    const printers = function({ error, lastLines }) {
      assert.strictEqual(error, "");
      assert.strictEqual(lastLines, "1\n2\n3\n4");
    };
    tail(
      ["node", "tail.js", "a.txt"],
      {
        isFileExist,
        reader
      },
      printers
    );
  });
});
