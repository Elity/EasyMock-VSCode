const vscode = require("vscode");

exports.getWorkspaceRoot = function() {
  const { workspaceFolders } = vscode.workspace;
  if (!workspaceFolders) return;
  const [rootPath] = workspaceFolders;
  const { uri: { fsPath } } = rootPath;
  return fsPath;
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

exports.getPort = function() {
  return getConfig("serverPort");
};

exports.getMockFolder = function() {
  return getConfig("mockFolderName");
};

exports.isEnableMockParse = function() {
  return getConfig("mockParse");
};

function getConfig(configName) {
  return vscode.workspace.getConfiguration("EasyMock").get(configName);
}
