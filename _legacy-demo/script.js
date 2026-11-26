// ===== ARIANE by TECMECA — démo =====
const WHATSAPP = '213550667847';

const CATS = {
  sols: { name: 'Sols', bg: 'linear-gradient(145deg,#e3f1ff,#cfe6ff)' },
  surfaces: { name: 'Surfaces', bg: 'linear-gradient(145deg,#e6fbf6,#ccf3ea)' },
  cuisine: { name: 'Cuisine', bg: 'linear-gradient(145deg,#fff6db,#ffeab0)' },
  bain: { name: 'Salle de bain', bg: 'linear-gradient(145deg,#f1ecff,#e0d6ff)' },
  linge: { name: 'Linge', bg: 'linear-gradient(145deg,#ffeef3,#ffd6e2)' },
};

// Produits de la gamme ARIANE (noms repris du site tecmecasarl.com).
// Photo : placer images/<id>.png (fond transparent) pour remplacer l'icône.
const PRODUCTS = [
  { id: 'milano', cat: 'sols', name: 'Balai MILANO', desc: 'Balai d\'intérieur pour le quotidien.', ico: '🧹' },
  { id: 'nocella', cat: 'sols', name: 'Balai NOCELLA', desc: 'Balai pratique pour toutes les pièces.', ico: '🧹' },
  { id: 'plata', cat: 'sols', name: 'Balai PLATA', desc: 'Balai pour sols lisses.', ico: '🧹' },
  { id: 'rustika', cat: 'sols', name: 'Balai RUSTIKA', desc: 'Balai robuste pour un usage intensif.', ico: '🧹' },
  { id: 'rena', cat: 'sols', name: 'Balai RENA', desc: 'Balai polyvalent.', ico: '🧹' },
  { id: 'trax', cat: 'sols', name: 'Pelle et balayette à manche long TRAX', desc: 'Ramassez sans vous baisser.', ico: '🧺' },
  { id: 'saturn', cat: 'sols', name: 'Seau essoreur SATURN', desc: 'Seau avec essoreur intégré.', ico: '🪣' },
  { id: 'tandim-duo', cat: 'sols', name: 'Porte manche TANDIM DUO', desc: 'Rangement mural pour 2 manches.', ico: '🪝' },
  { id: 'tandim-trio', cat: 'sols', name: 'Porte manche TANDIM TRIO', desc: 'Rangement mural pour 3 manches.', ico: '🪝' },
  { id: 'soly', cat: 'surfaces', name: 'Chiffons viscose multi-usages SOLY 2pcs+1', desc: 'Chiffons absorbants pour toutes les surfaces.', ico: '🧻' },
  { id: 'first', cat: 'surfaces', name: 'Peau de chamois FIRST', desc: 'Pour vitres, carrosseries et surfaces brillantes.', ico: '✨' },
  { id: 'maestro', cat: 'cuisine', name: 'Éponge abrasif MAESTRO 2pcs', desc: 'Double face pour la vaisselle.', ico: '🧽' },
];

let filter = 'all';
let q = '';
const chipsEl = document.getElementById('chips');
const productsEl = document.getElementById('products');

function renderChips() {
  chipsEl.innerHTML = [['all', 'Tous'], ...Object.entries(CATS).map(([k, v]) => [k, v.name])]
    .map(([k, n]) => `<button class="chip ${k === filter ? 'is-active' : ''}" data-cat="${k}">${n}</button>`).join('');
}
function renderProducts() {
  const s = q.trim().toLowerCase();
  const list = PRODUCTS.filter(p => (filter === 'all' || p.cat === filter) && (!s || (p.name + p.desc).toLowerCase().includes(s)));
  if (!list.length) {
    const cat = CATS[filter];
    productsEl.innerHTML = `<div class="soon"><strong>${s ? 'Aucun produit trouvé' : `Gamme ${cat ? cat.name : ''} bientôt en ligne`}</strong>
      <p>Demandez le catalogue complet à notre équipe : <a class="link" href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener">WhatsApp</a></p></div>`;
    return;
  }
  productsEl.innerHTML = list.map(p => `
    <article class="product">
      <div class="product__img" style="--img:url('images/${p.id}.png');--bg:${CATS[p.cat].bg}"><span class="product__cat">${CATS[p.cat].name}</span>${p.ico}</div>
      <div class="product__body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product__actions">
          <button class="btn btn--blue btn--sm" data-pro="${p.id}">Prix pro</button>
          <button class="btn btn--white btn--sm" data-where="${p.id}">Où acheter ?</button>
        </div>
      </div>
    </article>`).join('');
}

chipsEl.addEventListener('click', e => {
  const c = e.target.closest('.chip'); if (!c) return;
  filter = c.dataset.cat; renderChips(); renderProducts();
});
document.getElementById('search').addEventListener('input', e => { q = e.target.value; renderProducts(); });
document.getElementById('universGrid').addEventListener('click', e => {
  const u = e.target.closest('.uni'); if (!u) return;
  filter = u.dataset.cat; renderChips(); renderProducts();
  document.getElementById('produits').scrollIntoView({ behavior: 'smooth' });
});

const wa = text => window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank');
productsEl.addEventListener('click', e => {
  const pro = e.target.closest('[data-pro]');
  const where = e.target.closest('[data-where]');
  if (pro) wa(`Bonjour ARIANE, je souhaite connaître le prix professionnel du produit : ${PRODUCTS.find(p => p.id === pro.dataset.pro).name}`);
  if (where) wa(`Bonjour ARIANE, où puis-je acheter le produit ${PRODUCTS.find(p => p.id === where.dataset.where).name} dans ma wilaya ?`);
});

// ===== Formulaires =====
function handleForm(id, build) {
  const form = document.getElementById(id);
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach(i => { const bad = !i.value.trim(); i.classList.toggle('is-invalid', bad); if (bad) ok = false; });
    form.querySelector('.error').hidden = ok;
    if (!ok) return;
    wa(build(new FormData(form)));
  });
}
handleForm('proForm', f => `Bonjour ARIANE,\nJe souhaite recevoir le catalogue professionnel.\n• Société : ${f.get('company')} (${f.get('type')})\n• Nom : ${f.get('name')}\n• Téléphone : ${f.get('phone')}\n• Wilaya : ${f.get('wilaya') || '—'}`);
handleForm('distForm', f => `Bonjour ARIANE,\nCandidature distributeur :\n• Société : ${f.get('company')} (${f.get('kind')})\n• Contact : ${f.get('name')} — ${f.get('phone')}\n• Zone : ${f.get('zone')}\n${f.get('msg') ? '• Message : ' + f.get('msg') : ''}`);

// ===== Navigation & animations =====
const links = document.getElementById('navLinks');
document.getElementById('burger').addEventListener('click', () => links.classList.toggle('is-open'));
links.addEventListener('click', e => { if (e.target.tagName === 'A') links.classList.remove('is-open'); });
const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
}), { threshold: .12 });
document.querySelectorAll('.head, .uni, .pros > *, .distrib > *, .brand').forEach((el, i) => {
  el.classList.add('reveal'); el.style.transitionDelay = (i % 5) * 70 + 'ms'; io.observe(el);
});
document.getElementById('year').textContent = new Date().getFullYear();

renderChips(); renderProducts();
