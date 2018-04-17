const vscode = require("vscode");

const console = vscode.window.createOutputChannel("EasyMock");

exports.log = function(msg) {
  console.appendLine(msg);
};

exports.showLog = function() {
  console.show();
};

exports.getWorkspaceRoot = function() {
  const { workspaceFolders } = vscode.workspace;
  if (!workspaceFolders) return;
  const [rootPath] = workspaceFolders;
  const {
    uri: { fsPath }
  } = rootPath;
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

exports.showConfirm = function(msg) {
  return vscode.window.showConfirm(msg);
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

exports.isEnableHelloPage = function() {
  return getConfig("helloPage");
};

function getConfig(configName) {
  return vscode.workspace.getConfiguration("EasyMock").get(configName);
}

function updateConfig(configName, configValue) {
  return vscode.workspace
    .getConfiguration("EasyMock")
    .update(configName, configValue);
}
