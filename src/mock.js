const fs = require('fs');
const url = require('url');
const path = require('path');
const glob = require('glob');
const assert = require('assert');
const proxy = require('express-http-proxy');
const log = require('./log');
const utils = require('./utils');
const { join, resolve } = path;

let MOCK_DIR;
let MOCK_FILES;
let ENABLE_PARSE;
let RESPONSE_TIME;
let APP;
let WATCH;
let watcher = null;
let ERROR_HANDLE;
let ERROR_STACK = []; // 错误处理函数还没绑定的时候，存储错误

function handleError(err) {
  if (ERROR_HANDLE) ERROR_HANDLE(err);
  else ERROR_STACK.push(err);
}

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
      handleError(e);
      log.err('Error:' + e.message + ',at ' + file);
    }
  });
  return config;
}

function createMockHandler(method, path, value) {
  return function mockHandler(req, res) {
    let data = typeof value === 'function' ? value(req) : value;
    if (ENABLE_PARSE !== false) {
      let mockParse = require('./parse');
      data = mockParse(data);
    }
    if (!RESPONSE_TIME) {
      res.json(data);
    } else {
      setTimeout(() => {
        res.json(data);
      }, RESPONSE_TIME);
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
      return join(url.parse(target).path, matchPath).replace(/\\/g, '/');
    },
  });
}

function realApplyMock() {
  const config = getConfig();
  if (
    config['*'] &&
    typeof config['*'] === 'string' &&
    config['*'].indexOf('http') === 0
  ) {
    APP.all('/*', proxy(config['*']));
  } else {
    Object.keys(config).forEach(key => {
      const { method, path } = parseKey(key);
      const val = config[key];
      const typeVal = typeof val;
      assert(!!APP[method], `method of ${key} is not valid`);
      assert(
        ['function', 'object', 'string'].includes(typeVal),
        `mock value of ${key} should be function or object or string, but got ${typeVal}`
      );
      if (typeVal === 'string') {
        // url转发的情形  /api/test  =>   https://www.xxx.com/api/test
        if (/\(.+\)/.test(path)) {
          path = new RegExp(`^${path}$`);
        }
        APP.use(path, createProxy(method, path, val));
      } else {
        APP[method](path, createMockHandler(method, path, val));
      }
    });
  }

  let lastIndex = null;
  APP._router.stack.some((item, index) => {
    if (item.name === 'HelloEasyMockMiddleware') {
      lastIndex = index;
      return true;
    }
  });

  watcher = WATCH(MOCK_FILES).on('change add unlink', (type, fsPath) => {
    log.info(`File changed(${type}):${fsPath}`);
    if (type === 'add') initMockFile(fsPath);
    watcher.close();
    APP._router.stack.splice(lastIndex + 1);
    applyMock();
  });
}

function parseKey(key) {
  let arr = key.trim().split(/\s+/);
  let [method, path] = arr;
  if (!path) {
    path = method;
    method = 'get';
  }
  return { method, path };
}
/**
 * 新建mock文件时，向里面写入导出语句模版
 * @param {*} filePath
 */
function initMockFile(filePath) {
  if (!fs.readFileSync(filePath, { encoding: 'utf8' })) {
    fs.writeFileSync(
      filePath,
      `module.exports = {
     
}`
    );
  }
}

function applyMock() {
  try {
    realApplyMock();
  } catch (e) {
    handleError(e);
    log.err(e);
    utils.log('Error:' + e.message);
    utils.showLog();
    watcher = WATCH(MOCK_FILES).on('change add unlink', (type, fsPath) => {
      log.info(`File changed(${type}):${fsPath}`);
      if (type === 'add') initMockFile(fsPath);
      watcher.close();
      applyMock();
    });
  }
}

/**
 * app  express application
 * mockPath  mock dir path
 * enableParse need to enable build-in mock parse
 * watch  file watch
 */

function startMock(app, mockPath, enableParse, watch, apiResponseTime) {
  MOCK_DIR = mockPath;
  MOCK_FILES = join(mockPath, '/**/*.js');
  ENABLE_PARSE = enableParse;
  APP = app;
  RESPONSE_TIME = apiResponseTime;
  WATCH = watch;
  if (!MOCK_DIR || !APP || !WATCH) throw Error('arguments error');
  applyMock();
  return function(errorHandle) {
    ERROR_HANDLE = errorHandle;
    ERROR_STACK.forEach(err => errorHandle(err));
  };
}

function stopMock() {
  watcher && watcher.close && watcher.close();
}

module.exports = { startMock, stopMock };
