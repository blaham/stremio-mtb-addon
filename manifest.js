module.exports = {
  id: "community.webshare",
  version: "1.0.0",
  name: "Webshare Addon",
  description: "Streamuj obsah z Webshare.cz přes Stremio",
  types: ["movie"],
  catalogs: [
    { type: "movie", id: "webshare-search", name: "Webshare Search", extra: [{ name: "search", isRequired: true }] }
  ],
  resources: ["catalog", "stream"],
  idPrefixes: ["ws_"]
};