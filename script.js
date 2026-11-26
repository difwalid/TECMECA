'use strict';

(() => {
  /* ---------- Sidebar ----------
     Desktop/tablet (> 780px): the « button collapses the sidebar to an icon rail and back (remembered).
     Mobile (<= 780px): the ☰ button opens the sidebar as a drawer; ×, the backdrop, Escape or a link close it. */
  const root = document.documentElement;
  const sidebar = document.querySelector('.sidebar');
  const menuButton = document.querySelector('.menu-toggle');
  const sideToggle = document.querySelector('.sidebar-toggle');
  const backdrop = document.querySelector('.sidebar-backdrop');
  const mobile = window.matchMedia('(max-width: 780px)');
  const STORAGE_KEY = 'ariane-sidebar';

  if (sidebar && menuButton && sideToggle) {
    const isOpen = () => sidebar.classList.contains('is-open');
    const isCollapsed = () => root.classList.contains('sidebar-collapsed');

    const syncToggle = () => {
      if (mobile.matches) {
        sideToggle.setAttribute('aria-label', 'Fermer le menu');
        sideToggle.setAttribute('aria-expanded', String(isOpen()));
      } else {
        sideToggle.setAttribute('aria-label', isCollapsed() ? 'Agrandir le menu' : 'Réduire le menu');
        sideToggle.setAttribute('aria-expanded', String(!isCollapsed()));
      }
      sideToggle.title = sideToggle.getAttribute('aria-label');
    };

    const openDrawer = () => {
      sidebar.classList.add('is-open');
      root.classList.add('menu-open');
      menuButton.setAttribute('aria-expanded', 'true');
      menuButton.setAttribute('aria-label', 'Fermer le menu');
      syncToggle();
      const current = sidebar.querySelector('.side-nav a[aria-current="page"]') || sidebar.querySelector('.side-nav a');
      window.setTimeout(() => current && current.focus(), 50);
    };

    const closeDrawer = (returnFocus = true) => {
      if (!isOpen()) return;
      sidebar.classList.remove('is-open');
      root.classList.remove('menu-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Ouvrir le menu');
      syncToggle();
      if (returnFocus) menuButton.focus();
    };

    const toggleCollapsed = () => {
      const collapsed = !isCollapsed();
      root.classList.toggle('sidebar-collapsed', collapsed);
      try { localStorage.setItem(STORAGE_KEY, collapsed ? 'collapsed' : 'expanded'); } catch (error) { /* storage unavailable */ }
      syncToggle();
    };

    menuButton.addEventListener('click', () => (isOpen() ? closeDrawer() : openDrawer()));
    sideToggle.addEventListener('click', () => (mobile.matches ? closeDrawer() : toggleCollapsed()));
    if (backdrop) backdrop.addEventListener('click', () => closeDrawer());
    sidebar.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeDrawer(false)));

    document.addEventListener('keydown', event => {
      if (!isOpen()) return;
      if (event.key === 'Escape') {
        closeDrawer();
        return;
      }
      if (event.key === 'Tab') { // keep keyboard focus inside the open drawer
        const items = [...sidebar.querySelectorAll('a, button')];
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });

    mobile.addEventListener('change', () => {
      closeDrawer(false);
      syncToggle();
    });
    syncToggle();
  }

  document.querySelectorAll('[data-year]').forEach(element => {
    element.textContent = new Date().getFullYear();
  });

  const grid = document.querySelector('#product-grid');
  if (grid) {
    const status = document.querySelector('#catalogue-status');
    const search = document.querySelector('#product-search');
    const category = document.querySelector('#category-filter');
    const labels = {
      sols: 'Sols',
      surfaces: 'Surfaces',
      cuisine: 'Cuisine',
      'salle-de-bain': 'Salle de bain',
      linge: 'Linge',
      autres: 'Autres'
    };
    const normalize = value => String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('fr')
      .trim();
    let products = [];

    const makeCard = product => {
      const card = document.createElement('article');
      card.className = 'product-card';
      const imageBox = document.createElement('div');
      imageBox.className = 'product-image';
      const imageName = product.image;

      if (typeof imageName === 'string' && /^[\w.-]+\.webp$/i.test(imageName)) {
        const image = document.createElement('img');
        image.src = `images/products/${imageName}`;
        image.alt = product.name || 'Produit ARIANE';
        image.loading = 'lazy';
        image.decoding = 'async';
        image.addEventListener('error', () => {
          imageBox.classList.add('is-missing');
          image.remove();
          imageBox.textContent = 'Photo indisponible';
        }, { once: true });
        imageBox.append(image);
      } else {
        imageBox.classList.add('is-missing');
        imageBox.textContent = 'Photo indisponible';
      }

      const body = document.createElement('div');
      body.className = 'product-card-body';
      const meta = document.createElement('div');
      meta.className = 'product-meta';
      const categoryName = document.createElement('span');
      categoryName.textContent = labels[product.category] || 'Entretien';
      const brand = document.createElement('span');
      brand.className = 'product-brand';
      brand.textContent = product.brand || 'ARIANE';
      meta.append(categoryName, brand);

      const title = document.createElement('h2');
      title.textContent = product.name || 'Produit ARIANE';
      const foot = document.createElement('div');
      foot.className = 'product-card-foot';
      const reference = document.createElement('span');
      reference.className = 'product-ref';
      reference.textContent = product.sku ? `Réf. ${product.sku}` : 'Catalogue ARIANE';
      const ask = document.createElement('a');
      ask.className = 'product-contact';
      ask.target = '_blank';
      ask.rel = 'noopener noreferrer';
      ask.textContent = 'Demander un prix ↗';
      ask.href = `https://wa.me/213550667847?text=${encodeURIComponent(`Bonjour ARIANE, je souhaite obtenir des informations sur le produit : ${title.textContent}`)}`;
      foot.append(reference, ask);
      body.append(meta, title, foot);
      card.append(imageBox, body);
      return card;
    };

    const render = () => {
      const query = normalize(search.value);
      const selectedCategory = category.value;
      const visible = products.filter(product => {
        const categoryMatches = !selectedCategory || (product.category || 'autres') === selectedCategory;
        const searchable = normalize([
          product.name,
          product.model,
          product.sku,
          product.orderSku,
          product.orderName,
          product.brand,
          labels[product.category]
        ].filter(Boolean).join(' '));
        return categoryMatches && (!query || searchable.includes(query));
      });

      grid.replaceChildren();
      if (!visible.length) {
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        const title = document.createElement('strong');
        title.textContent = 'Aucun produit trouvé';
        const message = document.createElement('span');
        message.textContent = 'Essayez un autre mot-clé ou une autre catégorie.';
        empty.append(title, message);
        grid.append(empty);
      } else {
        const fragment = document.createDocumentFragment();
        visible.forEach(product => fragment.append(makeCard(product)));
        grid.append(fragment);
      }
      status.textContent = `${visible.length} produit${visible.length > 1 ? 's' : ''} affiché${visible.length > 1 ? 's' : ''}`;
    };

    const params = new URLSearchParams(window.location.search);
    const initialCategory = params.get('category');
    if (initialCategory && [...category.options].some(option => option.value === initialCategory)) {
      category.value = initialCategory;
    }
    search.addEventListener('input', render);
    category.addEventListener('change', render);

    fetch('data/products.json')
      .then(response => {
        if (!response.ok) throw new Error(`Chargement du catalogue impossible (${response.status}).`);
        return response.json();
      })
      .then(data => {
        if (!data || !Array.isArray(data.products)) throw new Error('Le format du catalogue est invalide.');
        products = data.products;
        render();
      })
      .catch(error => {
        status.textContent = `${error.message} Ouvrez le site via un serveur local pour charger les produits.`;
        grid.replaceChildren();
      });
  }

  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    const status = document.querySelector('#form-status');
    contactForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;

      const data = new FormData(contactForm);
      const message = [
        'Bonjour TECMECA / ARIANE,',
        '',
        `Nom : ${data.get('name')}`,
        data.get('company') ? `Entreprise : ${data.get('company')}` : '',
        `E-mail : ${data.get('email')}`,
        `Sujet : ${data.get('topic')}`,
        '',
        String(data.get('message') || '').trim()
      ].filter(Boolean).join('\n');

      status.textContent = 'Votre message est prêt. WhatsApp va s’ouvrir dans un nouvel onglet.';
      const whatsapp = `https://wa.me/213550667847?text=${encodeURIComponent(message)}`;
      const newWindow = window.open(whatsapp, '_blank', 'noopener,noreferrer');
      if (!newWindow) window.location.href = whatsapp;
    });
  }
})();
