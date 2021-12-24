const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/items',
    createProxyMiddleware({
      target: 'http://52.231.48.130:8080',
      changeOrigin: true
    })
  );
};
