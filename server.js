const express = require("express");
const addonInterface = require("./index");
const app = express();
const PORT = process.env.PORT || 7000;

app.use(express.json());
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

app.get("/manifest.json", (req, res) => {
  res.json(addonInterface.get("manifest"));
});

app.get("/:resource/:type/:id.json", (req, res) => {
  const { resource, type, id } = req.params;
  addonInterface.get(resource, type, id)
    .then(response => {
      if (!response) return res.status(404).send("Nenalezeno");
      res.json(response);
    })
    .catch(err => {
      console.error(`❌ Chyba při získávání ${resource}/${type}/${id}:`, err);
      res.status(500).send("Chyba serveru");
    });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Addon běží na portu ${PORT}`);
});
