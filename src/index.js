// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const watch = require("./watch");
const utils = require("./utils");
const server = require("./server");
const mock = require("./mock");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "easymock" is now active!');

  let running = false;
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.runMcok", function() {
      if (running) return;
      running = true;
      const rootPath = utils.getWorkspaceRoot();
      if (!rootPath) {
        utils.showError("Can't find workspace folder!");
        return;
      }
      utils.showInfo(rootPath);
      const mockPath = path.join(rootPath, "mock");
      if (!fs.existsSync(mockPath)) {
        fs.mkdirSync(mockPath);
      }

      utils.showInput("enter port (8999):").then((port = 8999) => {
        server.start(9999).then(mock);
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.stopMcok", function() {
      if (!running) return;
      server.stop();
      running = false;
    })
  );
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
