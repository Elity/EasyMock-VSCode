const vscode = require("vscode");

const console = vscode.window.createOutputChannel("EasyMock");

exports.getWorkspaceRoot = function() {
  const { workspaceFolders } = vscode.workspace;
  if (!workspaceFolders) return;
  const [rootPath] = workspaceFolders;
  const { uri: { fsPath } } = rootPath;
  return fsPath;
};

exports.log = function(msg) {
  console.appendLine(msg);
};

exports.showLog = function() {
  console.show();
};

exports.disposeConsole = function() {
  console.dispose();
};

exports.showInfo = function(msg) {
  vscode.window.showInformationMessage(msg);
};

exports.showError = function(msg) {
  vscode.window.showErrorMessage(msg);
};

exports.showInput = function(prompt) {
  return vscode.window.showInputBox({
    prompt
  });
};
