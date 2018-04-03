const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const lang = vscode.env.language || "en";

let config = {};
try {
  config = require(`./${lang}`);
} catch (e) {
  config = require("./en");
}

module.exports = config;
