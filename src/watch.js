const chokidar = require("chokidar");

function watch(globPath) {
  // chokidar.watch 传入glob类型地址的时候 不能是 windows风格的斜杠
  const watcher = chokidar.watch(globPath.replace(/\\/g, "/"), {
    ignored: /node_modules/,
    ignoreInitial: true
  });
  return {
    on(eventNames, fn) {
      eventNames
        .split(/\s+/)
        .filter(name => name)
        .map(name => name.toLowerCase())
        .forEach(name => name && watcher.on(name, fn.bind(null, name)));
      return this;
    },
    close() {
      watcher.close();
    }
  };
}

module.exports = watch;
