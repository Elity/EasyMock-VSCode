module.exports = {
  HelloEasyMockMiddleware() {
    return function HelloEasyMockMiddleware(req, res, next) {
      res.send("<h1>Hello EasyMock!</h1>");
    };
  },

  corsMiddleware() {
    return function corsMiddleware(req, res, next) {
      var method =
        req.method && req.method.toUpperCase && req.method.toUpperCase();
      res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "Access-Control-Allow-Headers": "X-Requested-With, Content-Type",
        "Access-Control-Allow-Credentials": "true"
      });

      if (method === "OPTIONS") {
        res.statusCode = 204;
        res.end();
      } else {
        next();
      }
    };
  }
};
