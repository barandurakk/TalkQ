const proxy = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(["/api", "/auth/google"], proxy({ target: "http://localhost:5000", changeOrigin: true }));
};

/*
Bu kısım localhost:3000(client) dan gonderilecek route'ların server side'da
(localhost:5000) çalışabilmesi için  (Bu sadece dev için.)
 */
