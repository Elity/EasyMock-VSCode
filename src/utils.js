const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

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

exports.getPort = function() {
  return getConfig("serverPort") || 9999;
};

exports.getMockFolder = function() {
  return getConfig("mockFolderName") || "mock";
};

exports.setExample = function(mockPath) {
  fs.writeFileSync(
    path.join(mockPath, "example.js"),
    `
module.exports = {
    // 默认get请求
    '/api/getInfo':{
        name: '张三',
        age: 28
    },
    // 指定请求方式
    'post /api/changeInfo':{
        message: 'success',
        status: 0
    },
    // 可以写成function得形式，从而可以根据请求参数定制响应数据
    '/api/getOrder':function(res,req){
        //res.query
        //res.params
        req.json({
            orderId:1214124124,
            price: 5.9
        }) 
    },
    // 也可以转发url到指定的服务器
    "/v2/movie/top250": "https://api.douban.com/"
    // 引入mockjs能更随机地模拟各种数据，包括图片、段落等等
}
    `
  );
};

function getConfig(configName) {
  vscode.workspace.getConfiguration("EasyMock").get(configName);
}
