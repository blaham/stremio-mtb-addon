require("dotenv").config();
const { serveHTTP } = require("stremio-addon-sdk");
const addonInterface = require("./index");
const PORT = process.env.PORT || 7000;

process.on("unhandledRejection", (reason) => {
  console.error("❌ Nezachycená promise:", reason);
});

serveHTTP(addonInterface, { port: PORT });
console.log(`🚀 Addon běží na portu ${PORT}`);