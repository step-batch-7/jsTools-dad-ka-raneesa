const { manageTailOperation } = require("./src/manageTailOperation");

const main = function(cmdArgs) {
  try {
    process.stdout.write(manageTailOperation(cmdArgs));
  } catch (e) {
    process.stderr.write(e.message);
  }
};

main(process.argv);
