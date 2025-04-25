require("dotenv").config();
const { serveHTTP } = require("stremio-addon-sdk");
const addonInterface = require("./index");
const PORT = process.env.PORT || 7000;

process.on("unhandledRejection", (reason) => {
  console.error("❌ Nezachycená promise:", reason);
});

// Spustíme Stremio addon server na všech rozhraních, aby ho Railway health check našel
serveHTTP(addonInterface, { port: PORT, host: "0.0.0.0" });
console.log(`🚀 Addon běží na 0.0.0.0:${PORT}`);