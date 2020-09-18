const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(createProxyMiddleware(["/api"], { target: "http://localhost:5000" }));
};

/*
Bu kısım localhost:3000(client) dan gonderilecek route'ların server side'da
(localhost:5000) çalışabilmesi için  (Bu sadece dev için.)
 */
