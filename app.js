/* ═══════════════ THE VAULT — app ═══════════════ */
'use strict';

/* ── CONFIG — fill in real details before launch ── */
const CONFIG = {
  WHATSAPP_NUMBER: '917373733998',
  PHONE_DISPLAY: '+91 73737 33998',
  PHONE_LINK: 'tel:+917373733998',
  HOURS: 'Open all days · 8:00 AM – 11:00 PM',
  INSTAGRAM: 'https://www.instagram.com/happy_liquors',
  SHOW_PRICES: true
};
const waLink = (msg) =>
  `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(msg || 'Hi Happy Liquors! I have a question.')}`;

/* ── AGE GATE ── */
(function ageGate(){
  const gate = document.getElementById('ageGate');
  const done = () => {
    gate.classList.add('hidden');
    document.body.style.overflow = '';
    heroIntro();
  };
  if (sessionStorage.getItem('hl_age_ok') === '1') { gate.classList.add('hidden'); }
  else { document.body.style.overflow = 'hidden'; }
  document.getElementById('ageYes').addEventListener('click', () => {
    sessionStorage.setItem('hl_age_ok', '1');
    done();
  });
  window.__ageDone = done;
})();

/* ── NAV ── */
(function nav(){
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive:true }); onScroll();
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');
  toggle.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
  document.querySelectorAll('section[id]').forEach(s => s.style.scrollMarginTop = '84px');
})();

/* ── CONTACT WIRING ── */
(function contact(){
  const msg = 'Hi Happy Liquors! I found your website and have a question.';
  ['waBtn','waBtn2','waFloat'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = waLink(msg);
  });
  const call = document.getElementById('callBtn');
  if (call) { call.href = CONFIG.PHONE_LINK; }
  const hours = document.getElementById('hoursText');
  const syncContactLang = () => {
    if (call) call.textContent = t('call_store') + ' · ' + CONFIG.PHONE_DISPLAY;
    if (hours) hours.textContent = t('hours');
  };
  syncContactLang();
  window.__i18nRefresh.push(syncContactLang);
})();

/* ═══════════════ CART — WhatsApp ordering ═══════════════ */
(function cart(){
  const LS_KEY = 'hl_cart_v1', PHONE_KEY = 'hl_cart_phone', ORD_KEY = 'hl_orders_v1';
  const inr = n => '₹' + Number(n).toLocaleString('en-IN');

  // registry: key -> {cat,n,p,r}
  const REG = {};
  for (const c of Object.keys(STOCK))
    for (const it of STOCK[c]) REG[`${c}|${it.n}|${it.p}`] = { cat: c, n: it.n, p: it.p, r: it.r };

  let items = {};
  try { items = JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch(e){ items = {}; }
  Object.keys(items).forEach(k => { if (!REG[k]) delete items[k]; }); // drop stale keys
  let orders = [];
  try { orders = JSON.parse(localStorage.getItem(ORD_KEY)) || []; } catch(e){ orders = []; }
  if (!Array.isArray(orders)) orders = [];

  const save = () => { try { localStorage.setItem(LS_KEY, JSON.stringify(items)); } catch(e){} };
  const qtyOf = k => (items[k] && items[k].q) || 0;

  const drawer  = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  const listEl  = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const countEl = document.getElementById('cartCount');
  const orderBtn= document.getElementById('orderWa');
  const phoneEl = document.getElementById('buyerPhone');
  const clearBtn= document.getElementById('cartClear');
  const histEl  = document.getElementById('orderHistory');
  try { phoneEl.value = localStorage.getItem(PHONE_KEY) || ''; } catch(e){}
  phoneEl.addEventListener('input', () => {
    try { localStorage.setItem(PHONE_KEY, phoneEl.value); } catch(e){}
    syncOrderLink();
  });

  const stepperHTML = (k, q) =>
    `<div class="stepper"><button data-act="dec" data-key="${k}" aria-label="Remove one">−</button><span>${q}</span><button data-act="inc" data-key="${k}" aria-label="Add one">+</button></div>`;
  window.__qtyCtrlHTML = k => {
    const q = qtyOf(k);
    return q ? stepperHTML(k, q) : `<button class="add-btn" data-act="add" data-key="${k}">${t('add')}</button>`;
  };
  const syncCardCtrls = () =>
    document.querySelectorAll('[data-qtyctrl]').forEach(el => { el.innerHTML = window.__qtyCtrlHTML(el.dataset.qtyctrl); });

  const totals = () => {
    let n = 0, amt = 0;
    for (const k of Object.keys(items)) { n += items[k].q; amt += items[k].q * (REG[k] ? REG[k].r : 0); }
    return { n, amt };
  };

  function syncOrderLink(){
    const keys = Object.keys(items);
    if (!keys.length) { orderBtn.href = waLink(); orderBtn.classList.add('disabled'); return; }
    orderBtn.classList.remove('disabled');
    const lines = keys.map(k => {
      const it = REG[k], q = items[k].q;
      return `• ${q} × ${it.n} — ${it.p} — ${inr(q * it.r)}`;
    });
    const { n, amt } = totals();
    let msg = `Hi Happy Liquors! I'd like to place an order:\n\n${lines.join('\n')}\n\nTotal: ${inr(amt)} (${n} item${n > 1 ? 's' : ''})`;
    const ph = phoneEl.value.trim();
    if (ph) msg += `\nMy mobile number: ${ph}`;
    orderBtn.href = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  function renderHistory(){
    if (!orders.length) { histEl.innerHTML = ''; histEl.style.display = 'none'; return; }
    histEl.style.display = '';
    histEl.innerHTML = `<p class="hist-title">${t('hist_title')}</p>` + orders.map((o, i) => {
      const d = new Date(o.t).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      return `<div class="hist-row">
        <span>${d} · ${o.n} item${o.n > 1 ? 's' : ''} · ${inr(o.total)}</span>
        <button class="hist-reorder" data-reorder="${i}">${t('hist_reorder')}</button>
      </div>`;
    }).join('');
  }

  function reorder(i){
    const o = orders[i]; if (!o) return;
    items = {};
    Object.keys(o.items || {}).forEach(k => { if (REG[k]) items[k] = { q: o.items[k] }; });
    save(); syncCardCtrls(); renderDrawer();
  }

  function renderDrawer(){
    const keys = Object.keys(items);
    listEl.innerHTML = keys.length ? keys.map(k => {
      const it = REG[k], q = items[k].q;
      return `<div class="cart-item">
        <div class="cart-item-info">
          <p class="cart-item-name">${it.n}</p>
          <p class="cart-item-pack">${it.p} · ${inr(it.r)}</p>
        </div>
        <div class="cart-item-ctrl">${stepperHTML(k, q)}</div>
        <p class="cart-item-line">${inr(q * it.r)}</p>
      </div>`;
    }).join('') :
    `<div class="cart-empty">
       <p class="cart-empty-title">${t('cart_empty_t')}</p>
       <p class="fineprint">${t('cart_empty_s')}</p>
     </div>`;
    const { n, amt } = totals();
    totalEl.textContent = inr(amt);
    countEl.textContent = n;
    countEl.style.display = n ? '' : 'none';
    clearBtn.style.display = keys.length ? '' : 'none';
    renderHistory();
    syncOrderLink();
  }

  function mutate(k, d){
    const q = qtyOf(k) + d;
    if (q <= 0) delete items[k]; else items[k] = { q };
    save(); syncCardCtrls(); renderDrawer();
  }
  window.HLCart = {
    add: k => mutate(k, 1),
    clear: () => { items = {}; save(); syncCardCtrls(); renderDrawer(); },
    addMany: entries => {
      entries.forEach(([k, q]) => { if (REG[k]) items[k] = { q: qtyOf(k) + q }; });
      save(); syncCardCtrls(); renderDrawer();
    },
  };
  window.__stockItems = Object.keys(REG).map(k => ({ key: k, ...REG[k] }));
  window.__regItem = (n, p) => {
    const k = Object.keys(REG).find(k => REG[k].n === n && REG[k].p === p);
    return k ? { key: k, ...REG[k] } : null;
  };
  window.__i18nRefresh.push(() => { syncCardCtrls(); renderDrawer(); });

  document.addEventListener('click', e => {
    const ro = e.target.closest('[data-reorder]');
    if (ro) { reorder(+ro.dataset.reorder); return; }
    const b = e.target.closest('[data-act]');
    if (!b || !REG[b.dataset.key]) return;
    const k = b.dataset.key, act = b.dataset.act;
    if (act === 'add' || act === 'inc') mutate(k, 1);
    else if (act === 'dec') mutate(k, -1);
  });

  // snapshot the order into history when it goes to WhatsApp
  orderBtn.addEventListener('click', () => {
    const keys = Object.keys(items);
    if (!keys.length) return;
    const { n, amt } = totals();
    orders.unshift({ t: Date.now(), items: Object.fromEntries(keys.map(k => [k, items[k].q])), total: amt, n });
    orders = orders.slice(0, 5);
    try { localStorage.setItem(ORD_KEY, JSON.stringify(orders)); } catch(e){}
    renderHistory();
  });

  const open  = () => { renderDrawer(); drawer.classList.add('open'); overlay.classList.add('show'); document.body.style.overflow = 'hidden'; };
  const close = () => { drawer.classList.remove('open'); overlay.classList.remove('show'); document.body.style.overflow = ''; };
  document.getElementById('cartBtn').addEventListener('click', open);
  document.getElementById('cartClose').addEventListener('click', close);
  overlay.addEventListener('click', close);
  clearBtn.addEventListener('click', () => window.HLCart.clear());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  renderDrawer();
})();

/* ═══════════════ THREE.JS HERO — the Vault bottle ═══════════════ */
(function hero3d(){
  const canvas = document.getElementById('gl');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  } catch(e){ canvas.style.display = 'none'; return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x070503, 0.055);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 1.7, 9);

  // — lights: a cellar lit in gold —
  scene.add(new THREE.AmbientLight(0x2a1c0e, 1.4));
  const key = new THREE.PointLight(0xffc861, 2.2, 40); key.position.set(6, 5, 6); scene.add(key);
  const rim = new THREE.PointLight(0xe8930c, 2.6, 40); rim.position.set(-6, 3, -4); scene.add(rim);
  const top = new THREE.SpotLight(0xf3d97b, 1.6, 40, 0.5); top.position.set(0, 10, 2); scene.add(top);

  // — the bottle: a lathed whisky silhouette —
  const bottle = new THREE.Group();
  const profile = [
    [0.001,0],[0.62,0],[0.62,0.08],[0.60,0.14],[0.60,1.45],[0.56,1.62],
    [0.36,2.02],[0.24,2.22],[0.22,2.34],[0.22,2.95],[0.27,3.0],[0.27,3.18],[0.001,3.18]
  ].map(p => new THREE.Vector2(p[0], p[1]));
  const glassMat = new THREE.MeshPhysicalMaterial({
    color:0x6b3d10, metalness:0.15, roughness:0.08,
    transparent:true, opacity:0.5, clearcoat:1, clearcoatRoughness:0.1,
    emissive:0x2a1503, emissiveIntensity:0.6, side:THREE.DoubleSide
  });
  bottle.add(new THREE.Mesh(new THREE.LatheGeometry(profile, 64), glassMat));

  // — the liquid inside —
  const liquidProfile = profile.map(v => new THREE.Vector2(Math.max(0.001, v.x - 0.07), v.y * 0.62));
  const liquid = new THREE.Mesh(
    new THREE.LatheGeometry(liquidProfile, 48),
    new THREE.MeshStandardMaterial({
      color:0xc46a12, emissive:0xa3530a, emissiveIntensity:1.1,
      roughness:0.25, metalness:0.1, transparent:true, opacity:0.92
    })
  );
  bottle.add(liquid);

  // — gold label band —
  const label = new THREE.Mesh(
    new THREE.CylinderGeometry(0.615, 0.615, 0.55, 64, 1, true),
    new THREE.MeshStandardMaterial({ color:0xd4af37, metalness:0.9, roughness:0.32, emissive:0x6b4d0e, emissiveIntensity:0.35, side:THREE.DoubleSide })
  );
  label.position.y = 0.95; bottle.add(label);

  // — cork —
  const cork = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.34, 32),
    new THREE.MeshStandardMaterial({ color:0x3a2412, roughness:0.9 })
  );
  cork.position.y = 3.28; bottle.add(cork);

  // — pedestal glow disc —
  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(1.5, 64),
    new THREE.MeshBasicMaterial({ color:0xd4af37, transparent:true, opacity:0.10 })
  );
  disc.rotation.x = -Math.PI/2; disc.position.y = 0.01; bottle.add(disc);

  const isMobile = () => window.innerWidth < 860;
  const placeBottle = () => {
    if (isMobile()) { bottle.position.set(0, -1.9, -0.5); bottle.scale.setScalar(0.5); }
    else { bottle.position.set(2.9, -0.5, 0); bottle.scale.setScalar(1); }
    bottle.userData.baseY = bottle.position.y;
  };
  placeBottle();
  scene.add(bottle);

  // — gold dust particles —
  const N = 420, pos = new Float32Array(N * 3), spd = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    pos[i*3] = (Math.random() - 0.5) * 22;
    pos[i*3+1] = Math.random() * 9 - 2;
    pos[i*3+2] = (Math.random() - 0.5) * 10;
    spd[i] = 0.15 + Math.random() * 0.5;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const dust = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color:0xe9c958, size:0.045, transparent:true, opacity:0.75,
    blending:THREE.AdditiveBlending, depthWrite:false
  }));
  scene.add(dust);

  // — mouse parallax —
  let mx = 0, my = 0, tx = 0, ty = 0;
  window.addEventListener('pointermove', e => {
    mx = (e.clientX / window.innerWidth - 0.5);
    my = (e.clientY / window.innerHeight - 0.5);
  }, { passive:true });

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    placeBottle();
  };
  window.addEventListener('resize', resize); resize();

  let running = true;
  new IntersectionObserver(en => { running = en[0].isIntersecting; }).observe(canvas);

  const clock = new THREE.Clock();
  window.__vault = { renderer, scene, camera, bottle, dust }; // debug hook
  (function tick(){
    requestAnimationFrame(tick);
    if (!running) return;
    const t = clock.getElapsedTime();
    bottle.rotation.y = t * 0.35;
    bottle.position.y = (bottle.userData.baseY ?? -0.5) + Math.sin(t * 0.8) * 0.08;
    const p = pGeo.attributes.position.array;
    for (let i = 0; i < N; i++) {
      p[i*3+1] += spd[i] * 0.008;
      p[i*3] += Math.sin(t * 0.6 + i) * 0.0012;
      if (p[i*3+1] > 7) p[i*3+1] = -2;
    }
    pGeo.attributes.position.needsUpdate = true;
    tx += (mx - tx) * 0.04; ty += (my - ty) * 0.04;
    camera.position.x = tx * 1.6;
    camera.position.y = 1.7 - ty * 1.0;
    camera.lookAt(isMobile() ? 0 : 1.1, 1.4, 0);
    renderer.render(scene, camera);
  })();
})();

/* ═══════════════ ANIMATIONS ═══════════════ */
if (!window.gsap) document.body.classList.add('no-motion');

function heroIntro(){
  if (!window.gsap || window.__heroPlayed) return;
  window.__heroPlayed = true;
  gsap.timeline({ defaults:{ ease:'power3.out' } })
    .from('.hero-kicker', { y:26, opacity:0, duration:0.9 }, 0.15)
    .from('.hero-title', { y:60, opacity:0, duration:1.2 }, 0.3)
    .from('.hero-sub',   { y:34, opacity:0, duration:1 }, 0.55)
    .from('.hero-actions .btn', { y:26, opacity:0, duration:0.8, stagger:0.12 }, 0.75)
    .from('.scroll-hint', { opacity:0, duration:1 }, 1.1);
}
if (sessionStorage.getItem('hl_age_ok') === '1') heroIntro();

(function reveals(){
  /* IntersectionObserver-based reveals — robust for smooth scroll,
     instant jumps, and dynamically injected content. */
  const pending = () => [...document.querySelectorAll('[data-reveal]:not(.in):not([data-io])')];
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    window.__observeReveals = () => pending().forEach(el => { el.setAttribute('data-io','1'); io.observe(el); });
  } else {
    window.__observeReveals = () => pending().forEach(el => el.classList.add('in'));
  }
  /* Animated counters */
  window.__initCounters = function(){
    const setFinal = el => el.textContent = el.dataset.count + (el.dataset.suffix || '');
    if (!window.gsap || !window.ScrollTrigger) {
      document.querySelectorAll('[data-count]').forEach(setFinal); return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = +el.dataset.count, suffix = el.dataset.suffix || '';
      ScrollTrigger.create({
        trigger: el, start: 'top 92%', once: true,
        onEnter: () => {
          const o = { v: 0 };
          gsap.to(o, { v: target, duration: 1.8, ease: 'power2.out',
            onUpdate: () => el.textContent = Math.round(o.v) + suffix });
        }
      });
    });
  };
})();

/* ═══════════════ COLLECTION BROWSER ═══════════════ */
(function collection(){
  const grid = document.getElementById('stockGrid');
  const tabs = document.getElementById('catTabs');
  const search = document.getElementById('stockSearch');
  const count = document.getElementById('stockCount');
  const more = document.getElementById('showMore');
  const cats = ['All', ...Object.keys(STOCK)];
  let activeCat = 'All', query = '', shown = 24;
  const PAGE = 24;

  const BANDS = [
    { k: 'band_all', min: 0, max: Infinity },
    { k: 'band_1', min: 0, max: 500 },
    { k: 'band_2', min: 500, max: 1000 },
    { k: 'band_3', min: 1000, max: 2500 },
    { k: 'band_4', min: 2500, max: Infinity },
  ];
  let priceBand = 0;
  const priceTabs = document.getElementById('priceTabs');
  function renderTabs(){
    tabs.innerHTML = cats.map(c =>
      `<button class="cat-tab${c === activeCat ? ' active' : ''}" data-cat="${c}">${t('cat_' + c)}</button>`).join('');
    priceTabs.innerHTML = BANDS.map((b, i) =>
      `<button class="price-tab${i === priceBand ? ' active' : ''}" data-band="${i}">${t(b.k)}</button>`).join('');
  }
  renderTabs();
  priceTabs.addEventListener('click', e => {
    const b = e.target.closest('.price-tab'); if (!b) return;
    priceTabs.querySelectorAll('.price-tab').forEach(t => t.classList.remove('active'));
    b.classList.add('active');
    priceBand = +b.dataset.band; shown = PAGE; render();
  });

  tabs.addEventListener('click', e => {
    const b = e.target.closest('.cat-tab'); if (!b) return;
    tabs.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    b.classList.add('active');
    activeCat = b.dataset.cat; shown = PAGE; render();
  });

  let deb;
  search.addEventListener('input', () => {
    clearTimeout(deb);
    deb = setTimeout(() => { query = search.value.trim().toLowerCase(); shown = PAGE; render(); }, 220);
  });
  more.addEventListener('click', () => { shown += PAGE; render(); });

  const allItems = () => {
    const out = [];
    for (const c of Object.keys(STOCK))
      for (const it of STOCK[c]) out.push({ ...it, cat: c });
    return out;
  };
  const ITEMS = allItems();

  function render(){
    let list = ITEMS;
    if (activeCat !== 'All') list = list.filter(i => i.cat === activeCat);
    const band = BANDS[priceBand];
    list = list.filter(i => i.r >= band.min && i.r < band.max);
    if (query) list = list.filter(i =>
      (i.n + ' ' + i.p + ' ' + i.cat).toLowerCase().includes(query));
    const total = list.length;
    const slice = list.slice(0, shown);
    count.textContent = t('showing').replace('{a}', slice.length).replace('{b}', total) + (query ? ` — “${search.value.trim()}”` : '');
    grid.innerHTML = slice.map(i => {
      const key = `${i.cat}|${i.n}|${i.p}`;
      return `
      <div class="stock-card" data-tilt>
        <span class="stock-cat">${t('cat_' + i.cat)}</span>
        <h4 class="stock-name">${i.n}</h4>
        <p class="stock-pack">${i.p || ''}</p>
        <div class="card-foot">
          ${CONFIG.SHOW_PRICES && i.r ? `<p class="stock-price">₹${Number(i.r).toLocaleString('en-IN')}</p>` : '<span></span>'}
          <div class="qty-ctrl" data-qtyctrl="${key}">${window.__qtyCtrlHTML ? window.__qtyCtrlHTML(key) : ''}</div>
        </div>
      </div>`;
    }).join('') || `<p class="fineprint">${t('nothing_found')}</p>`;
    more.style.display = shown < total ? '' : 'none';
    bindTilt(grid);
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  // 3D tilt on cards
  function bindTilt(scope){
    if (window.matchMedia('(hover: none)').matches) return;
    scope.querySelectorAll('[data-tilt]').forEach(card => {
      if (card.__tilt) return; card.__tilt = true;
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }
  bindTilt(document);
  render();
  window.__i18nRefresh.push(() => { renderTabs(); render(); });
})();

/* ═══════════════ JOURNAL + READER ═══════════════ */
(function journal(){
  const grid = document.getElementById('journalGrid');
  const reader = document.getElementById('reader');
  const body = document.getElementById('readerBody');
  grid.innerHTML = ARTICLES.map(a => `
    <article class="j-card" data-reveal data-tilt data-id="${a.id}">
      <span class="j-num">${a.no} — JOURNAL</span>
      <h3>${a.title}</h3>
      <p>${a.excerpt}</p>
      <span class="j-link">Read the story</span>
    </article>`).join('');

  const open = id => {
    const a = ARTICLES.find(x => x.id === id); if (!a) return;
    body.innerHTML = `<p class="kicker">${a.no} · ${a.tag}</p><h2>${a.title}</h2>${a.body}
      <div class="pair-box"><strong>Find it on our shelves</strong><br>We stock ${a.title.toLowerCase()} across budgets — ask our team or browse the Collection above.</div>`;
    reader.classList.add('open');
    document.body.style.overflow = 'hidden';
    reader.querySelector('.reader-card').scrollTop = 0;
  };
  const close = () => {
    reader.classList.remove('open');
    if (document.getElementById('ageGate').classList.contains('hidden'))
      document.body.style.overflow = '';
  };
  grid.addEventListener('click', e => {
    const c = e.target.closest('.j-card'); if (c) open(c.dataset.id);
  });
  document.getElementById('readerClose').addEventListener('click', close);
  reader.addEventListener('click', e => { if (e.target === reader) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ═══════════════ FAQ ═══════════════ */
(function faq(){
  const FAQS = [
    ['What is the legal drinking age?', '18+. The legal drinking age in Karaikal (Puducherry UT) is 18 years, and we take it seriously — please carry a valid government ID, as our team may ask to see it.'],
    ['Is Happy Liquors a shop or a bar?', 'Both. We\u2019re a full retail liquor store <em>and</em> a bar with a restaurant kitchen. Grab a bottle to take home, or pull up a chair and let us pour.'],
    ['Where exactly are you located?', '29, Bharathiyar Road, near the Old Bus Stand, Kilinjalmedu, Karaikal, Puducherry 609602. Tap \u201cVisit Us\u201d above for the live map.'],
    ['What are your opening hours?', CONFIG.HOURS + '. Hours may vary on public holidays — message us on WhatsApp to confirm.'],
    ['Can I buy bottles to take home?', 'Yes — our retail store stocks 490+ labels across whisky, brandy, beer, vodka, rum, wine, tequila, gin and more.'],
    ['Do you serve food?', 'Yes! Our kitchen serves bar bites and full plates designed to pair with your pour — from Chicken 65 to cheese platters. See the Sip & Savour section for our favourite pairings.'],
    ['Can I book a table or host a celebration?', 'Absolutely. Message us on WhatsApp and we\u2019ll help you plan birthdays, team dinners and private gatherings.'],
    ['Do you stock premium and imported brands?', 'Yes — from everyday favourites to single malts, VSOPs and craft brews. If there\u2019s something specific you\u2019re hunting, ask us on WhatsApp and we\u2019ll check the shelf.'],
    ['Can I place an enquiry on WhatsApp?', 'Please do — that\u2019s the fastest way to reach us for stock checks, bulk orders, table bookings and party planning.'],
    ['Do you promote responsible drinking?', 'Always. Strictly 18+, never drink and drive, and our team is happy to pace your evening — including suggesting lower-ABV options and food pairings.']
  ];
  const list = document.getElementById('faqList');
  list.innerHTML = FAQS.map(([q, a]) => `
    <div class="faq-item" data-reveal>
      <button class="faq-q">${q}<span class="fx">+</span></button>
      <div class="faq-a"><p>${a}</p></div>
    </div>`).join('');
  list.addEventListener('click', e => {
    const btn = e.target.closest('.faq-q'); if (!btn) return;
    const item = btn.parentElement, ans = item.querySelector('.faq-a');
    const isOpen = item.classList.contains('open');
    list.querySelectorAll('.faq-item.open').forEach(o => {
      o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight = null;
    });
    if (!isOpen) { item.classList.add('open'); ans.style.maxHeight = ans.scrollHeight + 'px'; }
  });
  // All dynamic content is now rendered — start observing reveals + counters.
  if (window.__observeReveals) window.__observeReveals();
  if (window.__initCounters) window.__initCounters();
})();

/* ═══════════════ REVIEW GENERATOR ═══════════════ */
(function reviewTool(){
  const MAPS_LINK = 'https://maps.app.goo.gl/q3PNzdSarZh8tLr48?g_st=ac';
  const QUESTIONS = [
    { key: 'stars', type: 'stars', qk: 'r_q0', hintk: 'r_q0h' },
    { key: 'bought', qk: 'r_q1', opts: ['Whisky', 'Brandy', 'Beer', 'Vodka', 'Rum', 'Wine', 'Tequila', 'Gin', 'Multiple bottles'] },
    { key: 'service', qk: 'r_q2', opts: ['Excellent', 'Good', 'Okay', 'Could be better'] },
    { key: 'standout', qk: 'r_q3', opts: ['Huge collection', 'Helpful staff', 'Fair prices', 'Quick billing', 'Bar & kitchen'] },
    { key: 'recommend', qk: 'r_q4', opts: ['Definitely', 'Yes', 'Maybe not'] },
  ];

  const tool = document.getElementById('reviewTool');
  const stepsEl = document.getElementById('reviewSteps');
  let step = 0, answers = {}, generated = '';
  const pick = a => a[(Math.random() * a.length) | 0];
  const answered = () => {
    const q = QUESTIONS[step];
    return q.type === 'stars' ? !!answers.stars : !!answers[q.key];
  };

  function generate(){
    const s = answers.stars || 5;
    const bought = (answers.bought || '').toLowerCase();
    const boughtTxt = !answers.bought || bought === 'multiple bottles' ? 'a few bottles' : 'some ' + bought;
    const parts = [];
    if (s >= 4) {
      parts.push(pick([
        'Had a great experience at Happy Liquors!',
        'Happy Liquors is the best liquor store in Karaikal.',
        'Really impressed with Happy Liquors!'
      ]));
      parts.push(`Picked up ${boughtTxt} — great selection and fair prices.`);
      const svc = {
        'Excellent': 'The staff were friendly and genuinely helpful.',
        'Good': 'Service was good and billing was quick.',
        'Okay': 'Service was okay.',
        'Could be better': 'Service has room to improve, but the collection makes up for it.'
      }[answers.service];
      if (svc) parts.push(svc);
      const st = {
        'Huge collection': 'The range of brands is unmatched in town.',
        'Helpful staff': 'The team knows their spirits and guides you well.',
        'Fair prices': 'Prices are honest — no surprises at the counter.',
        'Quick billing': 'In and out in minutes; billing was super quick.',
        'Bar & kitchen': 'Loved the bar & kitchen side too — a great place to unwind.'
      }[answers.standout];
      if (st) parts.push(st);
      parts.push(
        answers.recommend === 'Definitely' ? 'Highly recommended!' :
        answers.recommend === 'Yes' ? 'Would definitely visit again.' : 'Worth checking out.');
    } else if (s === 3) {
      parts.push(pick(['A decent liquor store in Karaikal.', 'Happy Liquors is a solid option in town.']));
      parts.push(`Picked up ${boughtTxt}. Good collection; service was average.`);
      parts.push('Worth a visit if you are nearby.');
    } else {
      parts.push('Visited Happy Liquors recently.');
      parts.push(`Picked up ${boughtTxt}. The collection is good, but my experience with the service could have been better.`);
      parts.push('Hope they keep improving — the store has real potential.');
    }
    return parts.join(' ');
  }

  function render(){
    const prog = QUESTIONS.map((_, i) => `<i class="${i < step ? 'done' : ''}"></i>`).join('') +
      `<i class="${step >= QUESTIONS.length ? 'done' : ''}"></i>`;
    if (step < QUESTIONS.length) {
      const q = QUESTIONS[step];
      const body = q.type === 'stars'
        ? `<div class="review-stars" id="starRow">` +
          [1, 2, 3, 4, 5].map(n =>
            `<button data-star="${n}" class="${answers.stars >= n ? 'lit' : ''}" aria-label="${n} star${n > 1 ? 's' : ''}">★</button>`).join('') +
          `</div>`
        : `<div class="review-opts">` + q.opts.map(o =>
            `<button class="review-opt${answers[q.key] === o ? ' sel' : ''}" data-opt="${o}">${opt(o)}</button>`).join('') +
          `</div>`;
      stepsEl.innerHTML = `
        <div class="review-progress">${prog}</div>
        <p class="review-q">${t(q.qk)}</p>
        <p class="review-hint">${t(q.hintk || 'r_hint')}</p>
        ${body}
        <div class="review-nav">
          ${step > 0 ? `<button class="review-back" id="rvBack">${t('r_back')}</button>` : '<span></span>'}
          <button class="btn btn-gold review-next${answered() ? '' : ' disabled'}" id="rvNext">${step === QUESTIONS.length - 1 ? t('r_gen') : t('r_next')}</button>
        </div>`;
      const row = document.getElementById('starRow');
      if (row) row.addEventListener('click', e => {
        const b = e.target.closest('[data-star]'); if (!b) return;
        answers.stars = +b.dataset.star;
        row.querySelectorAll('button').forEach(x => x.classList.toggle('lit', +x.dataset.star <= answers.stars));
        document.getElementById('rvNext').classList.remove('disabled');
      });
      stepsEl.querySelectorAll('[data-opt]').forEach(b => b.addEventListener('click', () => {
        answers[q.key] = b.dataset.opt;
        stepsEl.querySelectorAll('[data-opt]').forEach(x => x.classList.toggle('sel', x === b));
        document.getElementById('rvNext').classList.remove('disabled');
      }));
      const back = document.getElementById('rvBack');
      if (back) back.addEventListener('click', () => { step--; render(); });
      document.getElementById('rvNext').addEventListener('click', () => {
        if (!answered()) return;
        step++;
        if (step === QUESTIONS.length) generated = generate();
        render();
      });
    } else {
      stepsEl.innerHTML = `
        <div class="review-progress">${prog}</div>
        <p class="review-result-label">${t('r_result')}</p>
        <textarea id="reviewText">${generated}</textarea>
        <div class="review-actions">
          <button class="review-copy" id="rvCopy">${t('r_copy')}</button>
          <a class="btn btn-gold" id="rvPost" href="${MAPS_LINK}" target="_blank" rel="noopener" style="text-align:center">${t('r_post')}</a>
        </div>
        <p class="fineprint" style="text-align:center">${t('r_how')}</p>
        <div style="text-align:center"><button class="review-again" id="rvAgain">${t('r_again')}</button></div>
        <div class="review-nav" style="margin-top:18px">
          <button class="review-back" id="rvBack">← Back</button><span></span>
        </div>`;
      const ta = document.getElementById('reviewText');
      document.getElementById('rvCopy').addEventListener('click', async function(){
        const done = () => { this.textContent = t('r_copied'); setTimeout(() => this.textContent = t('r_copy'), 2000); };
        try { await navigator.clipboard.writeText(ta.value); done(); }
        catch(e) { ta.select(); try { document.execCommand('copy'); done(); } catch(_) {} }
      });
      document.getElementById('rvAgain').addEventListener('click', () => { generated = generate(); ta.value = generated; });
      document.getElementById('rvBack').addEventListener('click', () => { step--; render(); });
    }
  }

  const open = () => {
    step = 0; answers = {}; generated = '';
    render(); tool.classList.add('open'); document.body.style.overflow = 'hidden';
  };
  const close = () => { tool.classList.remove('open'); document.body.style.overflow = ''; };
  document.getElementById('reviewClose').addEventListener('click', close);
  tool.addEventListener('click', e => { if (e.target === tool) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && tool.classList.contains('open')) close(); });
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-review]')) open();
  });
  window.__openReviewTool = open;
  window.__i18nRefresh.push(() => { if (tool.classList.contains('open')) render(); });
})();

/* ═══════════════ OFFERS ═══════════════ */
(function offers(){
  // Abi: add/remove offers here — {tag, title, desc, cta, link}
  const OFFERS = [
    {
      tag: 'REWARD', tag_ta: 'பரிசு',
      title: 'Review us, get up to ₹100 store credit',
      title_ta: 'ரிவியூ எழுதுங்கள், ₹100 ஸ்டோர் கிரெடிட் பெறுங்கள்',
      desc: 'Had a good pour with us? Answer 5 quick questions and we\'ll draft your Google review for you — post it and get up to ₹100 redeemable store credit on your next visit. Just show your review at the counter to claim it.',
      desc_ta: 'எங்களுடன் நல்ல அனுபவமா? 5 எளிய கேள்விகளுக்கு பதிலளியுங்கள் — உங்கள் கூகுள் ரிவியூவை நாங்கள் தயார் செய்து தருகிறோம். பதிவிட்டு கவுண்டரில் காட்டினால், அடுத்த வருகையில் ₹100 வரை ஸ்டோர் கிரெடிட்.',
      cta: 'Write my review', cta_ta: 'ரிவியூ எழுதுங்கள்',
      tool: 'review'
    }
  ];
  const grid = document.getElementById('offerGrid');
  if (!grid || !OFFERS.length) return;
  const renderOffers = () => {
    const L = window.__lang();
    grid.innerHTML = OFFERS.map(o => `
    <article class="offer-card" data-reveal>
      <span class="offer-tag">${L === 'ta' && o.tag_ta ? o.tag_ta : o.tag}</span>
      <h3>${L === 'ta' && o.title_ta ? o.title_ta : o.title}</h3>
      <p>${L === 'ta' && o.desc_ta ? o.desc_ta : o.desc}</p>
      ${o.tool === 'review'
        ? `<button class="btn btn-gold btn-sm" data-open-review>${L === 'ta' && o.cta_ta ? o.cta_ta : o.cta}</button>`
        : (o.cta && o.link ? `<a class="btn btn-gold btn-sm" href="${o.link}" target="_blank" rel="noopener">${o.cta} ↗</a>` : '')}
    </article>`).join('');
    if (window.__observeReveals) window.__observeReveals();
  };
  renderOffers();
  window.__i18nRefresh.push(renderOffers);
})();

/* ═══════════════ PARTY PACKS ═══════════════ */
(function packs(){
  // Abi: edit packs here — [exact product name, pack size, quantity]
  const PACKS = [
    {
      tag: 'MATCH NIGHT', tag_ta: 'மேட்ச் நைட்',
      name: 'Match Night Pack', name_ta: 'மேட்ச் நைட் பேக்',
      desc: 'Eight chilled strong beers — built for match nights with the gang.',
      desc_ta: 'கேங்குடன் மேட்ச் பார்க்க — 8 குளிர்ந்த ஸ்ட்ராங் பீர்கள்.',
      items: [['Kingfisher Strong Beer (New)', '650ml', 8]]
    },
    {
      tag: 'HOUSE PARTY', tag_ta: 'வீட்டு பார்ட்டி',
      name: 'House Party for 8', name_ta: '8 பேர் வீட்டு பார்ட்டி',
      desc: 'A full bottle of whisky plus beers to keep the night going.',
      desc_ta: 'ஒரு முழு விஸ்கி பாட்டில் + இரவு முழுவதும் பீர்.',
      items: [['Royal Stag Whiskey', '750ml', 1], ['Kingfisher Strong Beer (New)', '650ml', 6]]
    },
    {
      tag: 'CELEBRATION', tag_ta: 'கொண்டாட்டம்',
      name: 'Celebration Pack', name_ta: 'கொண்டாட்ட பேக்',
      desc: 'A 12-year whisky and a bold red — for the big occasions.',
      desc_ta: '12 வருட விஸ்கி + கனமான ரெட் ஒயின் — பெரிய கொண்டாட்டங்களுக்கு.',
      items: [['100 Pipers 12 Years Whiskey (new)', '750ml', 1], ['Fratelli Cabernet Franc Shiraz Wine', '750ml', 1]]
    }
  ];
  const inr = n => '₹' + Number(n).toLocaleString('en-IN');
  const grid = document.getElementById('packGrid');
  if (!grid) return;
  const renderPacks = () => {
    const L = window.__lang();
    grid.innerHTML = PACKS.map((pk, pi) => {
      const rows = pk.items.map(([n, p, q]) => {
        const it = window.__regItem(n, p);
        if (!it) return '';
        return `<li><span>${q} × ${it.n} · ${it.p}</span><strong>${inr(q * it.r)}</strong></li>`;
      }).join('');
      const total = pk.items.reduce((s, [n, p, q]) => {
        const it = window.__regItem(n, p); return s + (it ? q * it.r : 0);
      }, 0);
      return `<article class="pack-card" data-reveal>
        <span class="offer-tag">${L === 'ta' && pk.tag_ta ? pk.tag_ta : pk.tag}</span>
        <h3>${L === 'ta' && pk.name_ta ? pk.name_ta : pk.name}</h3>
        <p class="pack-desc">${L === 'ta' && pk.desc_ta ? pk.desc_ta : pk.desc}</p>
        <ul class="pack-items">${rows}</ul>
        <div class="pack-foot">
          <p class="pack-total">${t('pack_total')}<strong>${inr(total)}</strong></p>
          <button class="btn btn-gold btn-sm" data-pack="${pi}">${t('pack_add')}</button>
        </div>
      </article>`;
    }).join('');
    if (window.__observeReveals) window.__observeReveals();
  };
  renderPacks();
  window.__i18nRefresh.push(renderPacks);
})();

/* ═══════════════ BOTTLE FINDER QUIZ ═══════════════ */
(function finder(){
  const tool = document.getElementById('finderTool');
  const stepsEl = document.getElementById('finderSteps');
  const BUDGETS = [
    { label: 'Under ₹500', lo: 0, hi: 500 },
    { label: '₹500 – ₹1,500', lo: 500, hi: 1500 },
    { label: '₹1,500 – ₹3,000', lo: 1500, hi: 3000 },
    { label: 'Above ₹3,000', lo: 3000, hi: Infinity },
  ];
  const TASTES = {
    'Smooth & mellow': ['Whisky', 'Brandy', 'Wine'],
    'Strong & bold': ['Whisky', 'Vodka', 'Tequila', 'Rum'],
    'Light & easy': ['Beer', 'Wine', 'Vodka'],
    'Sweet & fruity': ['Wine', 'Liqueurs', 'Rum'],
  };
  const QUESTIONS = [
    { key: 'budget', qk: 'f_b_q', opts: BUDGETS.map(b => b.label) },
    { key: 'occasion', qk: 'f_o_q', opts: ['House party', 'Gift', 'Quiet evening', 'Celebration'] },
    { key: 'taste', qk: 'f_t_q', opts: Object.keys(TASTES) },
  ];
  let step = 0, answers = {};
  const inr = n => '₹' + Number(n).toLocaleString('en-IN');
  const answered = () => !!answers[QUESTIONS[step].key];
  const opt = v => window.__opt(v);

  function recommend(){
    const b = BUDGETS.find(x => x.label === answers.budget) || BUDGETS[0];
    const cats = TASTES[answers.taste] || [];
    const occ = answers.occasion || '';
    const score = i => {
      let s = Math.random() * 0.4;
      if (occ === 'Gift' || occ === 'Celebration') s += (i.r - b.lo) / 20000;
      if (occ === 'House party' && i.cat === 'Beer') s += 0.7;
      if (occ === 'Quiet evening' && (i.cat === 'Wine' || i.cat === 'Whisky')) s += 0.4;
      return s;
    };
    let pool = window.__stockItems.filter(i => i.r >= b.lo && i.r < b.hi && cats.includes(i.cat));
    if (pool.length < 3) pool = pool.concat(
      window.__stockItems.filter(i => cats.includes(i.cat) && !pool.includes(i))
        .sort((a, c) => Math.abs(a.r - (b.lo + b.hi) / 2) - Math.abs(c.r - (b.lo + b.hi) / 2)));
    pool.forEach(i => i._s = score(i));
    pool.sort((a, c) => c._s - a._s);
    const seen = new Set(), out = [];
    for (const i of pool) {
      if (!seen.has(i.n)) { seen.add(i.n); out.push(i); }
      if (out.length === 3) break;
    }
    return out;
  }

  function render(){
    const prog = QUESTIONS.map((_, i) => `<i class="${i < step ? 'done' : ''}"></i>`).join('') +
      `<i class="${step >= QUESTIONS.length ? 'done' : ''}"></i>`;
    if (step < QUESTIONS.length) {
      const q = QUESTIONS[step];
      stepsEl.innerHTML = `
        <div class="review-progress">${prog}</div>
        <p class="review-q">${t(q.qk)}</p>
        <p class="review-hint">${t('f_hint')}</p>
        <div class="review-opts">` + q.opts.map(o =>
          `<button class="review-opt${answers[q.key] === o ? ' sel' : ''}" data-opt="${o}">${window.__opt(o)}</button>`).join('') +
        `</div>
        <div class="review-nav">
          ${step > 0 ? `<button class="review-back" id="fdBack">${t('f_back')}</button>` : '<span></span>'}
          <button class="btn btn-gold review-next${answered() ? '' : ' disabled'}" id="fdNext">${step === QUESTIONS.length - 1 ? t('f_find') : t('f_next')}</button>
        </div>`;
      stepsEl.querySelectorAll('[data-opt]').forEach(b => b.addEventListener('click', () => {
        answers[q.key] = b.dataset.opt;
        stepsEl.querySelectorAll('[data-opt]').forEach(x => x.classList.toggle('sel', x === b));
        document.getElementById('fdNext').classList.remove('disabled');
      }));
      const back = document.getElementById('fdBack');
      if (back) back.addEventListener('click', () => { step--; render(); });
      document.getElementById('fdNext').addEventListener('click', () => {
        if (!answered()) return;
        step++; render();
      });
    } else {
      const recs = recommend();
      stepsEl.innerHTML = `
        <div class="review-progress">${prog}</div>
        <p class="review-result-label">${t('f_result')}</p>
        <div class="find-results">` + (recs.map(i => `
          <div class="find-card">
            <span class="stock-cat">${t('cat_' + i.cat)}</span>
            <h4>${i.n}</h4>
            <p class="stock-pack">${i.p}</p>
            <div class="card-foot">
              <p class="stock-price">${inr(i.r)}</p>
              <div class="qty-ctrl" data-qtyctrl="${i.key}">${window.__qtyCtrlHTML(i.key)}</div>
            </div>
          </div>`).join('') || `<p class="fineprint">${t('f_nomatch')}</p>`) +
        `</div>
        <div class="review-nav" style="margin-top:18px">
          <button class="review-back" id="fdBack">${t('f_retake')}</button>
          <button class="btn btn-gold" id="fdDone">${t('f_done')}</button>
        </div>`;
      document.getElementById('fdBack').addEventListener('click', () => { step = 0; answers = {}; render(); });
      document.getElementById('fdDone').addEventListener('click', close);
    }
  }

  const open = () => {
    step = 0; answers = {};
    render(); tool.classList.add('open'); document.body.style.overflow = 'hidden';
  };
  const close = () => { tool.classList.remove('open'); document.body.style.overflow = ''; };
  document.getElementById('finderBtn').addEventListener('click', open);
  tool.querySelector('[data-finder-close]').addEventListener('click', close);
  tool.addEventListener('click', e => { if (e.target === tool) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && tool.classList.contains('open')) close(); });
  window.__i18nRefresh.push(() => { if (tool.classList.contains('open')) render(); });
})();
