const vscode = require('vscode');

const console = vscode.window.createOutputChannel('EasyMock');

function showPick(msg, optional) {
  return vscode.window.showQuickPick(optional, {
    placeHolder: msg,
    ignoreFocusOut: true,
  });
}

exports.log = function(msg) {
  console.appendLine(msg);
};

exports.showLog = function() {
  console.show();
};

exports.getWorkspaceRoot = async function(showMsgWhenNeedUserSelect) {
  const { workspaceFolders } = vscode.workspace;
  if (!workspaceFolders) return;
  if (workspaceFolders.length === 1) {
    const [rootPath] = workspaceFolders;
    const {
      uri: { fsPath },
    } = rootPath;
    return fsPath;
  } else {
    const workspaces = workspaceFolders.reduce((acc, cur) => {
      acc[cur.name] = cur.uri.fsPath;
      return acc;
    }, {});
    const userSelect = await showPick(showMsgWhenNeedUserSelect, [...Object.keys(workspaces)]);
    return workspaces[userSelect] || workspaceFolders[0].uri.fsPath;
  }
};

exports.showInfo = function(msg) {
  vscode.window.showInformationMessage(msg);
};

exports.showError = function(msg) {
  vscode.window.showErrorMessage(msg);
};

exports.showInput = function(prompt) {
  return vscode.window.showInputBox({
    prompt,
  });
};

exports.showPick = showPick;

exports.getPort = function() {
  return getConfig('serverPort');
};

exports.getMockFolder = function() {
  return getConfig('mockFolderName');
};

exports.getCorsHeaders = function() {
  return getConfig('corsHeaders');
};

exports.isEnableMockParse = function() {
  return getConfig('mockParse');
};

exports.isEnableHelloPage = function() {
  return getConfig('helloPage');
};

exports.getResponseTime = function() {
  return getConfig('responseTime');
};

function getConfig(configName) {
  return vscode.workspace.getConfiguration('EasyMock').get(configName);
}

function updateConfig(configName, configValue) {
  return vscode.workspace.getConfiguration('EasyMock').update(configName, configValue);
}
