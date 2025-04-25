const express = require("express");
const app = express();
const addonInterface = require("./index");

const PORT = process.env.PORT || 7000;

app.get("/manifest.json", (req, res) => {
    res.send(addonInterface.manifest);
});

app.get("/:resource/:type/:id.json", async (req, res) => {
    try {
        const response = await addonInterface.get(req.params.resource, req.params.type, req.params.id);
        if (!response) return res.status(404).send("Not found");
        res.send(response);
    } catch (err) {
        console.error("❌ Chyba v routě /:resource/:type/:id.json", err);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Addon běží na portu ${PORT}`);
});
