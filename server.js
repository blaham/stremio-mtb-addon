const express = require("express");
const app = express();
const addonInterface = require("./index");

const PORT = process.env.PORT || 7000; // ← přidáno

app.get("/manifest.json", (req, res) => {
    res.send(addonInterface.manifest);
});

app.get("/:resource/:type/:id.json", (req, res) => {
    addonInterface.get(req.params.resource, req.params.type, req.params.id)
        .then(resp => {
            if (!resp) return res.status(404).send("Not found");
            res.send(resp);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Internal Server Error");
        });
});

app.listen(PORT, () => {
    console.log(`🚀 Addon běží na portu ${PORT}`);
});
