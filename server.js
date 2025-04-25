const express = require("express");
const app = express();
const addonInterface = require("./index");

const PORT = process.env.PORT || 7000;

// Připojení celé addon logiky jako middleware
app.use("/", addonInterface);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Addon běží na portu ${PORT}`);
});