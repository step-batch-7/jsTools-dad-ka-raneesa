class StreamPicker {
  constructor(createFileStream, createStdinStream) {
    this.createFileStream = createFileStream;
    this.createStdinStream = createStdinStream;
  }

  pick(filename) {
    if (filename) {
      return this.createFileStream(filename);
    }
    return this.createStdinStream();
  }
}

module.exports = StreamPicker;
