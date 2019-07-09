const fs = require('fs');
const path = require('path');

module.exports = function(mockPath) {
  fs.writeFileSync(
    path.join(mockPath, 'example.js'),
    `
  module.exports = {
      // 默认get请求
      '/api/getInfo':{
          name: '张三',
          age: 28
      },
      // 指定请求方式为post
      'post /api/changeInfo':{
          message: 'success',
          status: 0
      },
      // 可以写成function的形式，从而可以根据请求参数定制响应数据
      '/api/getOrder':function(res){
          //res.query  获取get请求参数
          //res.body   获取post请求参数
          return {
              orderId:1214124124,
              price: Math.random(),
              userName: fns => fns.str(2,4)    // 如果启用了内置mock，依然可以使用内置mock函数
          }
      },
      // 也可以转发url到指定的服务器
      "/v2/movie/top250": "https://api.douban.com/",
  
      // 如果没关闭内置的mock解释器，可以这样使用：
      // 更多用法参见插件说明
      '/api/mock/parse/test':{
        "data|10":[{
          "id":"@inc(10000)",
          "age|18-30":0,
          "name":"@cstr(2,4)",
          "desc":"@cparagraph",
          "a|1":["张三","李四","王五"]
        }]
      },
      // 开启内置mock解析的时候，对象值也可以是一个函数，函数的参数是一个包含所有内置函数的对象
      // 函数形式调用可以解决 {id:"@inc(100)"} 这样占位函数永远只能返回字符串类型的问题
      '/api/mock/parse/testfns':{
        "data|10":[{
          "name":"@cstr(3)",
          "id":mock=>mock.inc(100),
          "rnd":()=>Math.random()
        }]
      }
      
      //内置mock解析语法参考了mock.js，不能与其同时使用
      //若需要使用mock.js，需要在设置里面将EasyMock.mockParse项设置为false
      //mock.js文档参考 http://mockjs.com/examples.html
  }
      `
  );
};
