# ARIANE / TECMECA — simple website

Four static pages in plain HTML, CSS and JavaScript. No build step, no framework, no dependencies.

```
index.html          Accueil
products.html       Nos produits (search + category filter)
about.html          À propos
contact.html        Contact (the form opens WhatsApp with the message ready)
styles.css          all styles
script.js           sidebar, product catalogue, contact form
data/products.json  the 181 products shown on products.html
images/             logo, favicon, photos, images/products/ (product photos)
```

## Sidebar

- **Computer and tablet:** the « button at the top of the sidebar collapses it to an icon bar, and » expands it again. Hovering an icon shows its label. The choice is remembered from page to page.
- **Phone (780 px wide or less):** the sidebar is hidden. The ☰ button opens it as a drawer. The × button, a tap outside it, the Escape key or choosing a page closes it.

## Viewing the site

`products.html` loads `data/products.json`, so open the folder through a local web server rather than by double-clicking the file:

```bash
python -m http.server 8000
```

Then visit http://127.0.0.1:8000.

`_legacy-demo/` holds the original demo mock-up. It isn't used by these pages.
