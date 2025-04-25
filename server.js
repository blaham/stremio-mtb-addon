const express = require("express");
const manifest = require("./manifest");
const addonInterface = require("./index");
const app = express();
const PORT = process.env.PORT || 7000;

// Catch unhandled rejections
process.on("unhandledRejection", (reason) => {
  console.error("❌ Nezachycená promise:", reason);
});

app.use(express.json());
app.use((req, res, next) => { console.log(`📡 ${req.method} ${req.url}`); next(); });

// Health-check for Railway
app.get("/", (req, res) => res.send("OK"));

// Serve manifest directly to avoid no-handler error
app.get("/manifest.json", (req, res) => {
  res.json(manifest);
});

// Delegate other resources to addonInterface
app.get("/:resource/:type/:id.json", async (req, res) => {
  try {
    const { resource, type, id } = req.params;
    const response = await addonInterface.get(resource, type, id);
    if (!response) return res.status(404).send("Nenalezeno");
    res.json(response);
  } catch (err) {
    console.error(`❌ Chyba při získávání ${req.params.resource}/${req.params.type}/${req.params.id}:`, err);
    res.status(500).send("Chyba serveru");
  }
});

app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Addon běží na portu ${PORT}`));