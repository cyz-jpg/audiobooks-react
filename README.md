# README

## Structuur

In deze applicatie bevat `pages/model` de modelpagina's.  
Dit zijn pagina's voor collecties of overzichten, zoals `users` en `audiobooks`.

`pages/object` bevat de objectpagina's.  
Dit zijn detailpagina's voor een specifiek object, zoals `users/:encodedUrl` en `audiobooks/:encodedUrl`.

---
## Rendering

Alle rendering wordt client side uitgevoerd.

## Routing

De applicatie gebruikt `HashRouter`, zodat routes ook blijven werken bij refresh zonder extra serverconfiguratie.

---

## Functionaliteit

- Op de modelpagina's staat de `add`-functionaliteit.  
- Op de objectpagina's staan de `update`- en `delete`-functionaliteiten.

---

## How to run with serve

```bash
npm run build
serve ./dist
