require("dotenv").config();
const { addonBuilder } = require("stremio-addon-sdk");
const axios = require("axios");
const xml2js = require("xml2js");
const manifest = require("./manifest");

const TOKEN = process.env.WST;
if (!TOKEN) {
  console.error("❌ Token není definován. Spusť nejdřív get_token.py");
  process.exit(1);
}

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(async ({ extra }) => {
  const query = extra.search?.toString().trim();
  if (!query) return { metas: [] };

  try {
    const { data } = await axios.post(
      "https://webshare.cz/api/search/",
      new URLSearchParams({ what: query, sort: "rating", limit: "20", offset: "0", category: "video" }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Accept": "text/xml; charset=UTF-8",
          "Authorization": `Bearer ${TOKEN}`
        }
      }
    );

    const result = await xml2js.parseStringPromise(data);
    const files = (result.response.status[0] === "OK" ? result.response.file : []) || [];

    return {
      metas: files.map(f => ({
        id: `ws_${f.ident[0]}`,
        name: f.name[0],
        type: "movie",
        poster: f.img?.[0],
        description: `Velikost: ${f.size?.[0]} | +${f.positive_votes?.[0] ?? 0} / -${f.negative_votes?.[0] ?? 0}`
      }))
    };
  } catch (err) {
    console.error("❌ Chyba při vyhledávání:", err);
    return { metas: [] };
  }
});

builder.defineStreamHandler(async ({ id }) => {
  try {
    // TODO: Integrace se stream API Webshare, nyní vrací prázdný seznam
    return { streams: [] };
  } catch (err) {
    console.error("❌ Chyba při získávání streamu:", err);
    return { streams: [] };
  }
});

module.exports = builder.getInterface();