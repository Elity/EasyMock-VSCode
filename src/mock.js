var fs = require("fs");
var url = require("url");
var path = require("path");
var glob = require("glob");
var assert = require("assert");
var proxy = require("express-http-proxy");
const watch = require("./watch");
const log = require("./log");
const { join, resolve } = path;

let MOCK_DIR;
let MOCK_FILES;
let ENABLE_PARSE;

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
      log.err("Error:" + e.message + ",at " + file);
    }
  });
  return config;
}

function createMockHandler(method, path, value) {
  return function mockHandler(req, res) {
    let data = typeof value === "function" ? value(req) : value;
    if (ENABLE_PARSE !== false) {
      let mockParse = require("./parse");
      data = mockParse(data);
    }
    res.json(data);
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
      // url转发的情形  /api/test  =>   https://www.xxx.com/api/test
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
    if (item.name === "HelloEasyMockMiddleware") {
      lastIndex = index;
      return true;
    }
  });

  watcher = watch(MOCK_FILES).on("change delete create", (type, { fsPath }) => {
    log.info(`File changed(${type}):${fsPath}`);
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
/**
 * 新建mock文件时，向里面写入导出语句模版
 * @param {*} filePath
 */
function initMockFile(filePath) {
  if (!fs.readFileSync(filePath, { encoding: "utf8" })) {
    fs.writeFileSync(
      filePath,
      `module.exports = {
     
}`
    );
  }
}

/**
 * app  express application
 * mockPath  mock dir path
 * enableParse need to enable build-in mock parse
 */

function applyMock(app, mockPath, enableParse) {
  if (mockPath) {
    MOCK_DIR = mockPath;
    MOCK_FILES = join(mockPath, "*.js");
  }
  if (ENABLE_PARSE) {
    ENABLE_PARSE = enableParse;
  }
  try {
    realApplyMock(app);
  } catch (e) {
    log.err(e);
    watcher = watch(MOCK_FILES).on(
      "change delete create",
      (type, { fsPath }) => {
        log.info(`File changed(${type}):${fsPath}`);
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
