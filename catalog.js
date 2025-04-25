const { addonBuilder } = require("stremio-addon-sdk");
const axios = require("axios");
const xml2js = require("xml2js");

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
            extra: [
                { name: "search", isRequired: true }
            ]
        }
    ],
    resources: ["catalog"],
    idPrefixes: []
};

const builder = new addonBuilder(manifest);

const WST = "j5fbympc"; // Zde vlož token získaný z API loginu

builder.defineCatalogHandler(async ({ type, id, extra }) => {
    const searchQuery = extra.search;

    if (!searchQuery) {
        return { metas: [] };
    }

    try {
        const response = await axios.post("https://webshare.cz/api/search/", new URLSearchParams({
            what: searchQuery,
            sort: "rating",
            limit: "20",
            offset: "0",
            category: "video"
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Accept": "text/xml; charset=UTF-8",
                "Authorization": `Bearer ${WST}`
            }
        });

        const result = await xml2js.parseStringPromise(response.data);

        if (result.response.status[0] !== "OK") {
            return { metas: [] };
        }

        const files = result.response.file || [];

        const metas = files.map(file => {
            return {
                id: file.ident[0],
                name: file.name[0],
                type: "movie",
                poster: file.img?.[0] || undefined,
                description: `Velikost: ${file.size?.[0]} | Hodnocení: +${file.positive_votes?.[0]} / -${file.negative_votes?.[0]}`
            };
        });

        return { metas };
    } catch (err) {
        console.error("Chyba při vyhledávání ve Webshare:", err);
        return { metas: [] };
    }
});

module.exports = builder.getInterface();
