# README

In deze applicatie bevat `pages/model` de modelpagina's. Dit zijn pagina's voor collecties of overzichten, zoals `users` en `audiobooks`.

`pages/object` bevat de objectpagina's. Dit zijn detailpagina's voor een specifiek object, zoals `users/:encodedUrl` en `audiobooks/:encodedUrl`.

De applicatie gebruikt `HashRouter`, zodat routes ook blijven werken bij refresh zonder extra serverconfiguratie.

De links van de homepagina naar de modelpagina's geven de API-bron door via een query parameter `src`, bijvoorbeeld `#/users?src=...`. De modelpagina leest die parameter uit om de juiste collectie-URL te kennen.

Op de modelpagina's staat de `add`-functionaliteit.

Op de objectpagina's staan de `update`- en `delete`-functionaliteiten.
