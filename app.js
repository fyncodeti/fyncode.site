/* ===============================
   Fyncode interactions (vanilla)
   =============================== */

/* 0) A11y do botão: defina no HTML algo como:
   <button class="nav-toggle" aria-controls="mobile-menu" aria-expanded="false" aria-label="Abrir menu" type="button">
     <span class="nav-toggle-bar"></span>
     <span class="nav-toggle-bar"></span>
     <span class="nav-toggle-bar"></span>
   </button>
*/

/* ano no rodapé (se existir) */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* 1) Scroll-reveal */
(() => {
  const toReveal = [
    ...document.querySelectorAll('.section'),
    ...document.querySelectorAll('.aud-card'),
    ...document.querySelectorAll('.chip'),
    ...document.querySelectorAll('.btn')
  ];
  toReveal.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('reveal-visible'); });
  }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
  toReveal.forEach(el => io.observe(el));
})();

/* 2) Scrollspy simples (realça link ativo) */
(() => {
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const sections = [...document.querySelectorAll('section[id]')];
  if (!navLinks.length || !sections.length) return;
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`));
    });
  }, { threshold: 0.5 });
  sections.forEach(s => spy.observe(s));
})();

/* 3) (reservado) */

/* 4) Tilt 3D suave nos cards (desktop) */
(() => {
  const isTouch = matchMedia('(hover: none)').matches;
  if (isTouch) return;
  document.querySelectorAll('.aud-card').forEach(card => {
    const wrap = document.createElement('div');
    wrap.className = 'tilt-wrap';
    const inner = document.createElement('div');
    inner.className = 'tilt';
    while (card.firstChild) inner.appendChild(card.firstChild);
    card.appendChild(wrap); wrap.appendChild(inner);

    const max = 10;
    function onMove(e){
      const r = wrap.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      inner.style.transform = `rotateY(${px*max}deg) rotateX(${-py*max}deg)`;
    }
    function reset(){ inner.style.transform = 'rotateY(0) rotateX(0)'; }
    wrap.addEventListener('mousemove', onMove);
    wrap.addEventListener('mouseleave', reset);
  });
})();

/* 5) Smooth-scroll que respeita a altura da topbar (60px) */
(() => {
  const NAV_H = 60;
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_H;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* 6) Aurora gradient (roxo interativo) — opcional. Descomente se quiser.
(function(){
  const host = document.querySelector('.plasma');
  if (!host) return;
  let t = 0, mx = 0.5, my = 0.5, raf;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function update(){
    const x1 = 50 + 22*Math.sin(t*0.35) + 14*(mx-0.5);
    const y1 = 24 + 18*Math.cos(t*0.27) + 10*(my-0.5);
    const x2 = 50 + 26*Math.cos(t*0.22 + 1.3) - 12*(mx-0.5);
    const y2 = 80 + 20*Math.sin(t*0.31 + 0.8) - 8*(my-0.5);
    host.style.setProperty('--x1', x1.toFixed(2) + '%');
    host.style.setProperty('--y1', y1.toFixed(2) + '%');
    host.style.setProperty('--x2', x2.toFixed(2) + '%');
    host.style.setProperty('--y2', y2.toFixed(2) + '%');
  }
  function tick(){ t += 0.016; update(); raf = requestAnimationFrame(tick); }
  if (!reduce){
    tick();
    window.addEventListener('mousemove', (e) => {
      const { innerWidth:w, innerHeight:h } = window;
      mx += ((e.clientX / w) - mx) * 0.08;
      my += ((e.clientY / h) - my) * 0.08;
    }, { passive:true });
  } else { update(); }
})();
*/

/* 7) Cursor dot branco (desktop) */
(() => {
  if (matchMedia('(hover: none)').matches) return;
  const dot = document.createElement('span');
  dot.className = 'cursor-dot hide';
  document.body.appendChild(dot);

  let x = innerWidth/2,  y = innerHeight/2;
  let tx = x,            ty = y;
  const ease = 0.18;
  let raf;

  const loop = () => {
    x += (tx - x) * ease;
    y += (ty - y) * ease;
    dot.style.setProperty('--tx', x.toFixed(2) + 'px');
    dot.style.setProperty('--ty', y.toFixed(2) + 'px');
    raf = requestAnimationFrame(loop);
  };

  window.addEventListener('mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
    dot.classList.remove('hide');
  }, { passive: true });
  window.addEventListener('mouseleave', () => dot.classList.add('hide'));
  window.addEventListener('mouseenter', () => dot.classList.remove('hide'));
  window.addEventListener('mousedown', () => dot.classList.add('pulse'));
  window.addEventListener('mouseup',   () => dot.classList.remove('pulse'));

  const hoverables = ['a','button','.btn','.mini-btn','.chip','[role="button"]'];
  document.addEventListener('mouseover', (e) => {
    if (hoverables.some(sel => e.target.closest(sel))) dot.classList.add('active');
  });
  document.addEventListener('mouseout', (e) => {
    if (hoverables.some(sel => e.target.closest(sel))) dot.classList.remove('active');
  });

  loop();
})();

/* 8) Pausa/resume global por visibilidade (reservado p/ animações futuras) */
(() => {
  const pausers = [];
  window.__registerPauseable = (ops) => pausers.push(ops); // {start, stop}
  document.addEventListener('visibilitychange', () => {
    pausers.forEach(p => document.hidden ? p.stop?.() : p.start?.());
  });
})();

/* ===== 9) Mobile menu (hamburger melhorado) ===== */
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.getElementById('mobile-menu');
  if (!toggle || !drawer) return;

  const panel = drawer.querySelector('.mobile-menu__panel');
  const backdrop = drawer.querySelector('.mobile-menu__backdrop');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NAV_H = 60;

  // Botão de fechar dentro do painel (garantia)
  let closeBtn = panel.querySelector('.mobile-menu__close');
  if (!closeBtn) {
    closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'mobile-menu__close';
    closeBtn.setAttribute('aria-label', 'Fechar menu');
    panel.prepend(closeBtn);
  }

  // A11y base
  toggle.setAttribute('aria-controls', 'mobile-menu');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir menu');

  const focusable = () => [...drawer.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])')];
  let lastFocus = null;

  function lockScroll(lock){
    document.documentElement.style.overflow = lock ? 'hidden' : '';
  }

  function open(){
    lastFocus = document.activeElement;
    drawer.hidden = false;
    requestAnimationFrame(()=> {
      drawer.classList.add('open');
      toggle.classList.add('is-open');
      toggle.setAttribute('aria-expanded','true');
      toggle.setAttribute('aria-label','Fechar menu');
      lockScroll(true);
      const first = focusable()[0];
      first?.focus();
    });
  }

  function close(){
    drawer.classList.remove('open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Abrir menu');
    lockScroll(false);
    // espera a animação para esconder
    const t = reduceMotion ? 0 : 280;
    setTimeout(()=> { drawer.hidden = true; }, t);
    lastFocus?.focus();
    // reset de estilos de arrasto
    panel.classList.remove('is-dragging', 'is-drag-ready');
    panel.style.transform = '';
    if (backdrop) backdrop.style.opacity = '';
  }

  const isOpen = () => drawer.classList.contains('open');

  // Ações do botão hambúrguer e do X
  toggle.addEventListener('click', (e) => {
    const r = document.createElement('span');
    r.className = 'rpl';
    toggle.appendChild(r);
    setTimeout(() => r.remove(), 520);
    isOpen() ? close() : open();
  });
  closeBtn.addEventListener('click', close);

  // clicar no backdrop fecha
  backdrop?.addEventListener('click', close);

  // ESC fecha + trap de foco
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) close();
    if (e.key === 'Tab' && isOpen()){
      const items = focusable();
      if (!items.length) return;
      const first = items[0], last = items[items.length-1];
      if (e.shiftKey && document.activeElement === first){ last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last){ first.focus(); e.preventDefault(); }
    }
  });

  // Links dentro do drawer:
  //  - âncoras (#...) => fecha e depois faz smooth-scroll compensando a topbar
  //  - externos       => fecha e deixa navegar normal
  drawer.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;

    const href = a.getAttribute('href') || '';
    const isHash = href.startsWith('#');

    if (isHash) {
      e.preventDefault();
      const target = document.querySelector(href);
      const t = reduceMotion ? 0 : 300;
      close();
      if (target) {
        setTimeout(() => {
          const top = target.getBoundingClientRect().top + window.scrollY - NAV_H;
          window.scrollTo({ top, behavior: 'smooth' });
        }, t);
      }
    } else {
      // externo: apenas fecha e navega normal
      close();
      // sem preventDefault -> o navegador segue o href
    }
  });

  // fecha ao redimensionar para desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 880 && isOpen()) close();
  });

  /* ---- Interações extras: hover magnético (desktop) ---- */
  if (!matchMedia('(hover: none)').matches){
    const bounds = () => toggle.getBoundingClientRect();
    let raf;
    const strength = 10; // px
    function onMove(e){
      const r = bounds();
      const cx = r.left + r.width/2;
      const cy = r.top + r.height/2;
      const dx = (e.clientX - cx) / (r.width/2);
      const dy = (e.clientY - cy) / (r.height/2);
      const tx = Math.max(-1, Math.min(1, dx)) * strength;
      const ty = Math.max(-1, Math.min(1, dy)) * strength;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(()=> {
        toggle.style.transform = `translate(${tx}px, ${ty}px)`;
      });
    }
    function reset(){
      cancelAnimationFrame(raf);
      toggle.style.transform = '';
    }
    toggle.addEventListener('mousemove', onMove);
    toggle.addEventListener('mouseleave', reset);
  }

  /* ---- Swipe-to-close no painel (robusto) ---- */
  (() => {
    if (!panel) return;

    const isInteractive = (el) =>
      !!el.closest('a, button, .mobile-link, input, textarea, select, [role="button"]');

    let dragging = false;
    let startX = 0, startY = 0;
    let dx = 0, dy = 0;
    let width = 0;
    const THRESHOLD_PX = 16;      // precisa arrastar >16px para "armar" o drag
    const ANGLE_MAX = 30;         // tolera até 30º de desvio vertical

    function onDown(e){
      if (!isOpen()) return;

      const target = e.target;
      // não inicia drag em elementos interativos
      if (isInteractive(target)) return;
      // só inicia se clicar dentro do painel
      if (!target.closest('.mobile-menu__panel')) return;

      dragging = true;
      startX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
      startY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
      width  = panel.offsetWidth || 0;
      dx = dy = 0;
      panel.classList.add('is-drag-ready');   // estado neutro (ainda não arrastando)
    }

    function onMove(e){
      if (!dragging) return;

      const x = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
      const y = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
      dx = Math.max(0, x - startX);      // só para a direita
      dy = Math.abs(y - startY);

      // Verifica ângulo e distância mínima
      const angle = Math.atan2(dy, Math.max(1, dx)) * 180 / Math.PI;
      const passed = dx > THRESHOLD_PX && angle <= ANGLE_MAX;

      if (!panel.classList.contains('is-dragging')){
        if (!passed) return;             // ainda não "armou" o drag
        panel.classList.remove('is-drag-ready');
        panel.classList.add('is-dragging');
      }

      // já estamos arrastando de fato
      const t = Math.min(width, dx);
      panel.style.transform = `translateX(${t}px)`;
      if (backdrop) backdrop.style.opacity = String(Math.max(0, 1 - t/width));
    }

    function onUp(){
      if (!dragging) return;
      dragging = false;

      const shouldClose = dx > width * 0.35;
      panel.classList.remove('is-drag-ready');

      if (panel.classList.contains('is-dragging')){
        panel.classList.remove('is-dragging');
        if (shouldClose) { close(); }
        else {
          panel.style.transform = ''; // volta
          if (backdrop) backdrop.style.opacity = '';
        }
      }
    }

    panel.addEventListener('pointerdown', onDown);
    panel.addEventListener('pointermove', onMove);
    panel.addEventListener('pointerup', onUp);
    panel.addEventListener('pointercancel', onUp);

    // suporte touch antigos
    panel.addEventListener('touchstart', onDown, { passive:true });
    panel.addEventListener('touchmove', onMove, { passive:true });
    panel.addEventListener('touchend', onUp);
    panel.addEventListener('touchcancel', onUp);
  })();

})();
