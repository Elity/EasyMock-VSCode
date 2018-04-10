const fs = require("fs");
const path = require("path");

function i18n(lang) {
  let config;
  try {
    config = require(`./${lang}`);
  } catch (e) {
    config = require("./en");
  }
  return config;
}

module.exports = i18n;
