# Change Log

All notable changes to the "EasyMock" extension will be documented in this file.

<!-- Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file. -->

## [1.0.13]

- 修复 CORS 头潜在冲突的 bug

## [1.0.12]

- 支持 mock 文件夹嵌套
- 修复模版数据中有 bool 值时出错的情况

## [1.0.11]

- 添加响应延时设置，可以模拟服务端响应很慢的情况
- 支持通过设置 url 的 key 部分为\*，实现代理所有请求到指定 url
- 添加辅助函数 phone,qq

## [1.0.10]

- 添加 host,url,email,ip 函数

## [1.0.8,1.0.9]

- 修复解析数组的 bug
- 替换内置 watch

## [1.0.7]

- 增加内置 pick 函数
- 增加内置 mock 值可为 function
- 修复内置 mock 处理数组的 bug

## [1.0.5,1.0.6]

- 完善错误提示

## [1.0.4]

- 修复 bug

## [1.0.3]

- 修复 bug,优化代码
- 增加 hello easymock 中间件

## [1.0.2]

- 内建 mock 解析，并完善文档

## [1.0.1]

- 监听 mock 目录下文件新增事件，如果是新建的文件，则在该文件添加模块导出语句

## [1.0.0]

- Initial release
