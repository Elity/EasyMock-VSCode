const express = require("express");
const utils = require("./utils");

let _server = null;

function start(port) {
  const app = express();
  app.use(express.static(utils.getWorkspaceRoot()));
  app.use(corsMiddleware());
  return new Promise((resolve, reject) => {
    _server = app
      .listen(port, () => {
        utils.log(`Mock Server started`);
        resolve(_server);
      })
      .on("error", error => {
        utils.showError(`Failed to start Mock Server due to ${error.message}`);
        reject(error);
        _server = null;
      })
      .on("request", (req, res) => {
        utils.log(`${req.method} ${req.originalUrl}`);
      });
  });
}

function stop() {
  return new Promise((resolve, reject) => {
    if (!_server) return reject("Mock Server not running");
    _server.close(() => {
      utils.log(`Mock Server close`);
      resolve();
    });
    _server = null;
  });
}

function corsMiddleware() {
  return (req, res, next) => {
    var method =
      req.method && req.method.toUpperCase && req.method.toUpperCase();
    res.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "Access-Control-Allow-Headers": "X-Requested-With, Content-Type",
      "Access-Control-Allow-Credentials": "true"
    });

    if (method === "OPTIONS") {
      res.statusCode = 204;
      res.end();
    } else {
      next();
    }
  };
}

module.exports = {
  start,
  stop
};
