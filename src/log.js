const chalk = require("chalk");

const prefix = "EasyMock:";

module.exports = {
  err(...arg) {
    console.log(chalk.red.apply(chalk, [prefix, ...arg]));
  },
  info(...arg) {
    console.log(chalk.green.apply(chalk, [prefix, ...arg]));
  }
};
