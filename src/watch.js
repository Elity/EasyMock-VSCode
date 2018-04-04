const vscode = require("vscode");

function watch(globPath) {
  const watcher = vscode.workspace.createFileSystemWatcher(globPath);

  function title(str) {
    return str.toLowerCase().replace(/^[a-z]/, L => L.toUpperCase());
  }

  return {
    on(eventNames, fn) {
      eventNames
        .split(/\s+/)
        .forEach(
          name =>
            name &&
            watcher[`onDid${title(name)}`](fn.bind(null, name.toLowerCase()))
        );
      return this;
    },
    close() {
      watcher.dispose();
    }
  };
}

module.exports = watch;
