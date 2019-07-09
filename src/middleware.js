module.exports = {
  HelloEasyMockMiddleware() {
    return function HelloEasyMockMiddleware(req, res, next) {
      res.send(`<h1>Hello EasyMock!</h1>
      <h5>You can disable the opening of this page in the configuration</h5>`);
    };
  },

  corsMiddleware(customHeader) {
    return function corsMiddleware(req, res, next) {
      let method =
        req.method && req.method.toUpperCase && req.method.toUpperCase();

      //Access-Control-Allow-Origin设置为*时，Access-Control-Allow-Credentials无法被设置为true
      //Access-Control-Allow-Origin设置为非*时，需设置Vary: 'Origin'头，标识不同origin跨域请求同一个资源需要区别对待
      res.set({
        'Access-Control-Allow-Origin': req.headers.origin || '*',
        'Access-Control-Allow-Methods':
          'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': `X-Requested-With, Content-Type,${customHeader}`,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': 86400,
        Vary: 'Origin',
      });

      if (method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
      } else {
        next();
      }
    };
  },
};
