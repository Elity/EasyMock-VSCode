// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const watch = require("./watch");
const utils = require("./utils");
const server = require("./server");
const mock = require("./mock");
const lang = require("./lang");
const opn = require("opn");
const mw = require("./mock");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  let running = false;
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(
    vscode.commands.registerCommand("easymock.runMcok", function() {
      if (running) return;
      running = true;
      const rootPath = utils.getWorkspaceRoot();
      if (!rootPath) {
        utils.showError(lang.noWorkspace);
        return;
      }
      const mockPath = path.join(rootPath, utils.getMockFolder());
      if (!fs.existsSync(mockPath)) {
        fs.mkdirSync(mockPath);
        utils.setExample(mockPath);
        utils.showInfo(lang.createMockFolder);
      }
      server
        .start(utils.getWorkspaceRoot(), utils.getPort())
        .then(app => {
          let helloPath = "/hello/easymock";
          app.use(mw.corsMiddleware());
          app.use(helloPath, mw.HelloEasyMockMiddleware());
          mock.applyMock(app);
          opn("http://127.0.0.1:" + utils.getPort() + helloPath);
          utils.showInfo(lang.startSuccess);
        })
        .catch(() => {
          running = false;
          utils.showError(lang.startFail);
        });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("easymock.stopMcok", function() {
      if (!running) return;
      server
        .stop()
        .then(() => {
          utils.showInfo(lang.stopSuccess);
          mock.stopWatcher();
          running = false;
        })
        .catch(err => utils.log(err));
    })
  );
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
