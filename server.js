const express = require("express");
const addonInterface = require("./index");
const app = express();
const PORT = process.env.PORT || 7000;

// Global handler for unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Nezachycená promise:", reason);
});

app.use(express.json());
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

// Health-check pro Railway
app.get("/", (req, res) => res.send("OK"));

app.get("/manifest.json", async (req, res) => {
  try {
    const manifestData = await addonInterface.get("manifest");
    res.json(manifestData);
  } catch (err) {
    console.error("❌ Chyba při získávání manifestu:", err);
    res.status(500).send("Chyba serveru");
  }
});

app.get("/:resource/:type/:id.json", async (req, res) => {
  const { resource, type, id } = req.params;
  try {
    const response = await addonInterface.get(resource, type, id);
    if (!response) return res.status(404).send("Nenalezeno");
    res.json(response);
  } catch (err) {
    console.error(`❌ Chyba při získávání ${resource}/${type}/${id}:`, err);
    res.status(500).send("Chyba serveru");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Addon běží na portu ${PORT}`);
});