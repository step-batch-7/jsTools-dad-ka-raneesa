"use strict";

const {
  filterUserOptions,
  parseUserOptions,
  generateErrorMessage,
  loadFileContent,
  getLastLines
} = require("../src/tailLib");
const { performTailOperation } = require("../src/performTailOperation.js");

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
    const expected = { noOfLines: 8, filePath: "a.txt" };
    assert.deepStrictEqual(actual, expected);
  });
});

describe("generateErrorMessage", function() {
  it("Should give error if file is not exist", function() {
    const actual = generateErrorMessage({
      filePath: "a.txt",
      msg: "no such file or directory"
    });
    assert.strictEqual(actual, "tail: a.txt: no such file or directory");
  });
});

describe("loadFileContent", function() {
  it("should load the file content", function() {
    let objectOfOptions = { filePath: "a.txt" };
    const reader = function(path) {
      assert.deepStrictEqual(path, "a.txt");
      return "1\n2\n3\n4\n5";
    };
    const expected = {
      data: "1\n2\n3\n4\n5",
      filePath: "a.txt"
    };
    assert.deepStrictEqual(
      loadFileContent(objectOfOptions, reader, "utf8"),
      expected
    );
  });
});

describe("getLastLines", function() {
  it("should give last ten line of file content if lines are more than 10", function() {
    const fileContent = {
      noOfLines: 10,
      data: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12"
    };
    let expected = "3\n4\n5\n6\n7\n8\n9\n10\n11\n12";
    assert.strictEqual(getLastLines(fileContent), expected);
  });
  it("should give last total line of file content if lines are less than 10", function() {
    const fileContent = {
      noOfLines: 10,
      data: "1\n2\n3\n4\n5"
    };
    let expected = "1\n2\n3\n4\n5";
    assert.strictEqual(getLastLines(fileContent), expected);
  });
  it("should give last total line of file content if tail count is given", function() {
    let data = "1\n2\n3\n4\n5\n6\n7\n8";
    let fileContent = { data, noOfLines: 5 };
    let expected = "4\n5\n6\n7\n8";
    assert.strictEqual(getLastLines(fileContent), expected);
  });
});

describe("performTailOperation", function() {
  it("Should give error if file is not exist", function() {
    const isFileExist = filePath => {
      return false;
    };
    const actual = performTailOperation(["node", "tail.js", "a.txt"], {
      isFileExist
    });

    assert.deepStrictEqual(actual, {
      error: "tail: a.txt: no such file or directory",
      lastLines: ""
    });
  });

  it("Should should give 10 last lines of a file if file has more than 10 lines ", function() {
    const reader = function(filePath, encoding) {
      return "3\n4\n5\n6\n7\n8\n9\n10\n11\n12";
    };
    const isFileExist = filePath => {
      return true;
    };
    const encoding = "utf8";
    const actual = performTailOperation(["node", "tail.js", "a.txt"], {
      isFileExist,
      reader,
      encoding
    });
    const expected = {
      lastLines: "3\n4\n5\n6\n7\n8\n9\n10\n11\n12",
      error: ""
    };
    assert.deepStrictEqual(actual, expected);
  });

  it("Should should give whole lines of a file if file has less than 10 lines ", function() {
    const reader = function(filePath, encoding) {
      return "1\n2\n3\n4\n5\n6";
    };
    const isFileExist = filePath => {
      return true;
    };
    const encoding = "utf8";
    const actual = performTailOperation(["node", "tail.js", "a.txt"], {
      isFileExist,
      reader,
      encoding
    });
    const expected = { lastLines: "1\n2\n3\n4\n5\n6", error: "" };
    assert.deepStrictEqual(actual, expected);
  });

  it("Should should give empty string if file is empty ", function() {
    const reader = function(filePath, encoding) {
      return "";
    };
    const isFileExist = filePath => {
      return true;
    };
    const encoding = "utf8";
    const actual = performTailOperation(["node", "tail.js", "a.txt"], {
      isFileExist,
      reader,
      encoding
    });
    const expected = { lastLines: "", error: "" };
    assert.deepStrictEqual(actual, expected);
  });

  it("Should should give 6 last lines of a file if file has more than given 6 lines in command ", function() {
    const reader = function(filePath, encoding) {
      return "7\n8\n9\n10\n11\n12";
    };
    const isFileExist = filePath => {
      return true;
    };
    const encoding = "utf8";
    const actual = performTailOperation(["node", "tail.js", "a.txt"], {
      isFileExist,
      reader,
      encoding
    });
    const expected = { lastLines: "7\n8\n9\n10\n11\n12", error: "" };
    assert.deepStrictEqual(actual, expected);
  });

  it("Should should give whole lines of a file if file has less than given 6 lines in command ", function() {
    const reader = function(filePath, encoding) {
      return "1\n2\n3\n4";
    };
    const isFileExist = filePath => {
      return true;
    };
    const encoding = "utf8";
    const actual = performTailOperation(["node", "tail.js", "a.txt"], {
      isFileExist,
      reader,
      encoding
    });
    const expected = { lastLines: "1\n2\n3\n4", error: "" };
    assert.deepStrictEqual(actual, expected);
  });
});
