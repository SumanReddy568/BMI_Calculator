const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',  // Specify the base URL path for proxying
    createProxyMiddleware({
      target: 'http://localhost:5000',  // Backend server URL
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''  // Remove '/api' from the path, if needed
      }
    })
  );
};
