const express = require("express");
const utils = require("./utils");
var bodyParser = require("body-parser");

let _server = null,
  app = null;

function start() {
  app = express();
  app.use(express.static(utils.getWorkspaceRoot()));
  app.use(corsMiddleware());
  app.use(bodyParser.json({ limit: "5mb", strict: false }));
  app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
  app.use("/hello/easymock", HelloEasyMockMiddleware());
  return new Promise((resolve, reject) => {
    _server = app
      .listen(utils.getPort(), () => {
        utils.log(`Mock Server started`);
        resolve(app);
      })
      .on("error", error => {
        utils.log(`Failed to start Mock Server due to ${error.message}`);
        reject(error);
        _server = null;
      })
      .on("request", (req, res) => {
        utils.log(`${req.method} ${req.originalUrl}`);
      });
    _server.addListener("connection", socket => {
      // 不设置socket连接超时的话无法停止服务
      socket.setTimeout(3e3);
    });
  });
}

function stop() {
  return new Promise((resolve, reject) => {
    if (!_server) return reject("Mock Server not running");
    _server.close(() => {
      utils.log(`Mock Server stopped`);
      _server = null;
      app = null;
      resolve();
    });
  });
}

function HelloEasyMockMiddleware() {
  return function easyMock(req, res, next) {
    res.send("<h1>Hello EasyMock!</h1>");
  };
}

function corsMiddleware() {
  return function corsMiddleware(req, res, next) {
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
