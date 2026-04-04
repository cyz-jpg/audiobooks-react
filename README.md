# README

In deze applicatie bevat `pages/model` de modelpagina's. Dit zijn pagina's voor collecties of overzichten, zoals `users` en `audiobooks`.

`pages/object` bevat de objectpagina's. Dit zijn detailpagina's voor een specifiek object, zoals `users/:encodedUrl` en `audiobooks/:encodedUrl`.

De applicatie gebruikt `HashRouter`, zodat routes ook blijven werken bij refresh zonder extra serverconfiguratie.

De homepagina geeft de collectie-URL door via `Link state`. Als die state ontbreekt, sturen de modelpagina's terug naar home.

Op de modelpagina's staat de `add`-functionaliteit.

Op de objectpagina's staan de `update`- en `delete`-functionaliteiten.
