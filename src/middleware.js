module.exports = {
  HelloEasyMockMiddleware() {
    return function HelloEasyMockMiddleware(req, res, next) {
      res.send(`<h1>Hello EasyMock!</h1>
      <h5>You can disable opening this page in the configuration</h5>`);
    };
  },

  corsMiddleware(customHeader) {
    return function corsMiddleware(req, res, next) {
      let method =
        req.method && req.method.toUpperCase && req.method.toUpperCase();
      res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": `X-Requested-With, Content-Type,${customHeader}`,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": 86400,
      });

      if (method === "OPTIONS") {
        res.statusCode = 204;
        res.end();
      } else {
        next();
      }
    };
  },
};
