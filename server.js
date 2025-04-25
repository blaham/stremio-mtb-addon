require("dotenv").config();
const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const manifest = require("./manifest");

// Vytvoříme builder a definujeme handlery (catalog a stream jsme už dřív implementovali ve index.js,
// případně sem můžete rovnou přesunout ten kód z index.js)
const { defineCatalogHandler, defineStreamHandler } = require("./index-handlers"); 
// index-handlers.js exportuje funkci, která vrátí builder s nadefinovanými handlery:
//   module.exports = (manifest, token) => {
//     const builder = new addonBuilder(manifest);
//     builder.defineCatalogHandler(...);
//     builder.defineStreamHandler(...);
//     return builder;
//   };

const builder = defineCatalogHandler(manifest, process.env.WST);
const addonInterface = builder.getInterface();

// Spustíme HTTP server, který:
– servíruje manifest na /manifest.json
– obslouží /catalog/... a /stream/... automagicky
serveHTTP(addonInterface, {
  port: process.env.PORT || 7000,
});

// Volitelné logování startu
console.log(`🚀 Addon běží na portu ${process.env.PORT || 7000}`);