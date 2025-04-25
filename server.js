require("dotenv").config();
const express = require("express");
const { getRouter } = require("stremio-addon-sdk");
const addonInterface = require("./index");
const app = express();
const PORT = process.env.PORT || 7000;

process.on("unhandledRejection", (reason) => {
  console.error("❌ Nezachycená promise:", reason);
});

// Essential health-check for Railway
app.get("/", (req, res) => res.send("OK"));
// Mount all addon routes (manifest, catalog, stream)
app.use(getRouter(addonInterface));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Addon běží na portu ${PORT}`);
});
