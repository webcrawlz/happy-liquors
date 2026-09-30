/* ═══════════════ THE VAULT — app ═══════════════ */
'use strict';

/* ── CONFIG — fill in real details before launch ── */
const CONFIG = {
  WHATSAPP_NUMBER: '917373733998',
  PHONE_DISPLAY: '+91 73737 33998',
  PHONE_LINK: 'tel:+917373733998',
  HOURS: 'Open all days · 8:00 AM – 11:00 PM',
  INSTAGRAM: 'https://www.instagram.com/happy_liquors',
  SHOW_PRICES: false                          // ← Abi: set true to show price-list prices publicly
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
  if (call) { call.href = CONFIG.PHONE_LINK; call.textContent = 'Call the store · ' + CONFIG.PHONE_DISPLAY; }
  const hours = document.getElementById('hoursText');
  if (hours) hours.textContent = CONFIG.HOURS;
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

  tabs.innerHTML = cats.map(c =>
    `<button class="cat-tab${c === 'All' ? ' active' : ''}" data-cat="${c}">${c}</button>`).join('');
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
    if (query) list = list.filter(i =>
      (i.n + ' ' + i.p + ' ' + i.cat).toLowerCase().includes(query));
    const total = list.length;
    const slice = list.slice(0, shown);
    count.textContent = `Showing ${slice.length} of ${total} labels${query ? ` for \u201c${search.value.trim()}\u201d` : ''}`;
    grid.innerHTML = slice.map(i => `
      <div class="stock-card" data-tilt>
        <span class="stock-cat">${i.cat}</span>
        <h4 class="stock-name">${i.n}</h4>
        <p class="stock-pack">${i.p || ''}</p>
        ${CONFIG.SHOW_PRICES && i.r ? `<p class="stock-price">\u20B9${i.r}</p>` : ''}
      </div>`).join('') || `<p class="fineprint">Nothing found — try another brand or spirit.</p>`;
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
