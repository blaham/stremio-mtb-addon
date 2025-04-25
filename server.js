const express = require("express");
const app = express();
const addonInterface = require("./index");

const PORT = process.env.PORT || 7000;

// Přidej ping logy, ať vidíme požadavky
app.use((req, res, next) => {
    console.log(`📡 Přijat požadavek: ${req.method} ${req.url}`);
    next();
});

// Manifest musí být získaný pomocí addonInterface.get
app.get("/manifest.json", async (req, res) => {
    try {
        const response = await addonInterface.get("manifest");
        res.json(response);
    } catch (err) {
        console.error("❌ Chyba při získávání manifestu:", err);
        res.status(500).send("Chyba serveru");
    }
});

app.get("/:resource/:type/:id.json", async (req, res) => {
    try {
        const response = await addonInterface.get(req.params.resource, req.params.type, req.params.id);
        if (!response) return res.status(404).send("Nenalezeno");
        res.json(response);
    } catch (err) {
        console.error("❌ Chyba při získávání resource:", err);
        res.status(500).send("Chyba serveru");
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Addon běží na portu ${PORT}`);
});
