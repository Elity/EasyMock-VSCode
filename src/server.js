const express = require("express");
var bodyParser = require("body-parser");

let _server = null,
  app = null;

function start(rootPath, port) {
  app = express();
  app.use(express.static(rootPath));
  app.use(bodyParser.json({ limit: "5mb", strict: false }));
  app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
  return new Promise((resolve, reject) => {
    _server = app
      .listen(port, () => {
        console.log(`Mock Server started`);
        resolve(app);
      })
      .on("error", error => {
        console.log(`Failed to start Mock Server due to ${error.message}`);
        reject(error);
        _server = null;
      })
      .on("request", (req, res) => {
        console.log(`${req.method} ${req.originalUrl}`);
      });
    _server.addListener("connection", socket => {
      // 不设置socket连接超时的话无法停止服务
      socket.setTimeout(3e3);
    });
  });
}

function stop() {
  return new Promise((resolve, reject) => {
    if (!_server) {
      const err = "Mock Server not running";
      console.log(err);
      return reject({ message: err });
    }
    _server.close(() => {
      console.log(`Mock Server stopped`);
      _server = null;
      app = null;
      resolve();
    });
  });
}

module.exports = {
  start,
  stop
};
