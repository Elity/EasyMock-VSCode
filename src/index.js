// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

const fs = require("fs");
const opn = require("opn");
const path = require("path");
const detect = require("detect-port");
const log = require("./log");
const i18n = require("./i18n");
const mock = require("./mock");
const vscode = require("vscode");
const utils = require("./utils");
const watch = require("./watch");
const server = require("./server");
const mw = require("./middleware");

const lang = i18n(vscode.env.language);
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
        require("./example")(mockPath);
        utils.showInfo(lang.createMockFolder);
      }
      let port = utils.getPort();
      detect(port)
        .then(newPort => {
          if (newPort != port) {
            return utils
              .showPick(lang.portOccupied + port, [
                lang.tryPort + newPort,
                lang.giveupPort + port
              ])
              .then(
                sel =>
                  sel === lang.tryPort + newPort ? (port = newPort) : port
              );
          } else {
            return port;
          }
        })
        .then(port => server.start(utils.getWorkspaceRoot(), port))
        .then(app => {
          const helloPath = "/hello/easymock";
          const mockPath = path.join(
            utils.getWorkspaceRoot(),
            utils.getMockFolder()
          );
          app.use(mw.corsMiddleware(utils.getCorsHeaders()));
          app.use(helloPath, mw.HelloEasyMockMiddleware());
          mock.startMock(app, mockPath, utils.isEnableMockParse(), watch)(
            err => {
              let errStr = err.stack
                .split("\n")
                .splice(0, 4)
                .join("\n");
              utils.log(errStr);
              utils.showError(errStr);
            }
          );
          utils.isEnableHelloPage() &&
            opn("http://127.0.0.1:" + port + helloPath);

          utils.showInfo(lang.startSuccess);
        })
        .catch(err => {
          log.err(err);
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
          mock.stopMock();
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
