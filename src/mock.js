var fs = require("fs");
var url = require("url");
var path = require("path");
var glob = require("glob");
var assert = require("assert");
var bodyParser = require("body-parser");
var proxy = require("express-http-proxy");
const watch = require("./watch");
const utils = require("./utils");
const { join, resolve } = path;

const MOCK_DIR = join(utils.getWorkspaceRoot(), utils.getMockFolder());
const MOCK_FILES = join(MOCK_DIR, "*.js");

let watcher = null;

function getConfig() {
  Object.keys(require.cache).forEach(file => {
    if (~file.indexOf(MOCK_DIR)) {
      delete require.cache[file];
    }
  });
  let config = {};
  glob.sync(MOCK_FILES).forEach(file => {
    try {
      Object.assign(config, require(file));
    } catch (e) {
      utils.log("Error:" + e.message + ",at " + file);
    }
  });
  return config;
}

function createMockHandler(method, path, value) {
  return function mockHandler(...args) {
    if (typeof value === "function") {
      value(...args);
    } else {
      args[1].json(value);
    }
  };
}

function createProxy(method, path, target) {
  return proxy(target, {
    filter(req) {
      return method ? req.method.toLowerCase() === method.toLowerCase() : true;
    },
    proxyReqPathResolver(req) {
      let matchPath = req.originalUrl;
      const matches = matchPath.match(path);
      if (matches.length > 1) {
        matchPath = matches[1];
      }
      return join(url.parse(target).path, matchPath).replace(/\\/g, "/");
    }
  });
}

function realApplyMock(app) {
  const config = getConfig();
  app.use(bodyParser.json({ limit: "5mb", strict: false }));
  app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));

  Object.keys(config).forEach(key => {
    const { method, path } = parseKey(key);
    const val = config[key];
    const typeVal = typeof val;
    assert(!!app[method], `method of ${key} is not valid`);
    assert(
      ["function", "object", "string"].includes(typeVal),
      `mock value of ${key} should be function or object or string, but got ${typeVal}`
    );
    if (typeVal === "string") {
      // url转发的情形  /api/test  =>   https://www.shiguangkey.com/api/mine
      if (/\(.+\)/.test(path)) {
        path = new RegExp(`^${path}$`);
      }
      app.use(path, createProxy(method, path, val));
    } else {
      app[method](path, createMockHandler(method, path, val));
    }
  });

  let lastIndex = null;
  app._router.stack.some((item, index) => {
    if (item.name === "expressInit") {
      lastIndex = index;
      return true;
    }
  });

  watcher = watch(MOCK_FILES).on("change delete create", (type, { fsPath }) => {
    utils.log(`File changed(${type}):${fsPath}`);
    if (type === "create") initMockFile(fsPath);
    watcher.close();
    app._router.stack.splice(lastIndex + 1);

    applyMock(app);
  });
}

function parseKey(key) {
  let arr = key.trim().split(/\s+/);
  let [method, path] = arr;
  if (!path) {
    path = method;
    method = "get";
  }
  return { method, path };
}

function initMockFile(filePath) {
  if (!fs.readFileSync(filePath, { encoding: "utf8" })) {
    fs.writeFileSync(
      filePath,
      `
module.exports = {

}    
    `
    );
  }
}

function applyMock(app) {
  try {
    realApplyMock(app);
  } catch (e) {
    utils.log(e);
    watcher = watch(MOCK_FILES).on(
      "change delete create",
      (type, { fsPath }) => {
        utils.log(`File changed(${type}):${fsPath}`);
        if (type === "create") initMockFile(fsPath);
        watcher.close();
        applyMock(app);
      }
    );
  }
}

function stopWatcher() {
  watcher && watcher.close && watcher.close();
}

module.exports = { applyMock, stopWatcher };
