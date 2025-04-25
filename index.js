console.log("🛠 index.js se spustil");
require("dotenv").config();
const { addonBuilder } = require("stremio-addon-sdk");
const axios = require("axios");
const xml2js = require("xml2js");

const WST = process.env.WST;

if (!WST) {
    console.error("❌ Token není definován. Spusť nejdřív get_token.py");
    process.exit(1);
}
console.log("🛠 nespadlo to na token");
const manifest = {
    id: "community.webshare",
    version: "1.0.0",
    name: "Webshare Addon",
    description: "Streamuj obsah z Webshare.cz přes Stremio",
    types: ["movie"],
    catalogs: [
        {
            type: "movie",
            id: "webshare-search",
            name: "Webshare Search",
            extra: [{ name: "search", isRequired: true }]
        }
    ],
    resources: ["catalog", "stream"],
    idPrefixes: []
};

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(async ({ type, id, extra }) => {
    const searchQuery = extra.search;
    if (!searchQuery) return { metas: [] };

    try {
        const response = await axios.post(
            "https://webshare.cz/api/search/",
            new URLSearchParams({
                what: searchQuery,
                sort: "rating",
                limit: "20",
                offset: "0",
                category: "video"
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "Accept": "text/xml; charset=UTF-8",
                    "Authorization": `Bearer ${WST}`
                }
            }
        );

        const result = await xml2js.parseStringPromise(response.data);
        if (result.response.status[0] !== "OK") return { metas: [] };

        const files = result.response.file || [];
        const metas = files.map(file => ({
            id: "ws_" + file.ident[0],
            name: file.name[0],
            type: "movie",
            poster: file.img?.[0],
            description: `Velikost: ${file.size?.[0]} | +${file.positive_votes?.[0] ?? 0} / -${file.negative_votes?.[0] ?? 0}`
        }));

        return { metas };
    } catch (err) {
        console.error("❌ Chyba při vyhledávání:", err.message);
        return { metas: [] };
    }
});

builder.defineStreamHandler(({ id }) => {
    return Promise.resolve({ streams: [] });
});

module.exports = builder.getInterface();
