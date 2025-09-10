/* ===============================
   Fyncode interactions (vanilla)
   =============================== */

// ano no rodapé (se existir)
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* 1) Scroll-reveal */
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

/* 2) Scrollspy simples (realça link ativo) */
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('section[id]')];
const spy = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const id = e.target.id;
    navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`));
  });
}, { threshold: 0.5 });
sections.forEach(s => spy.observe(s));

/* 4) Tilt 3D suave nos cards (desktop) */
const isTouch = matchMedia('(hover: none)').matches;
if (!isTouch) {
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
}

/* 6) Nav: clique com smooth-scroll respeitando altura da barra (60px) */
const NAV_H = 60;
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - NAV_H;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ========== Aurora gradient (roxo interativo) ========== */
// (function(){
//   const host = document.querySelector('.plasma');
//   if (!host) return;

//   let t = 0, mx = 0.5, my = 0.5, raf;
//   const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

//   function update(){
//     const x1 = 50 + 22*Math.sin(t*0.35) + 14*(mx-0.5);
//     const y1 = 24 + 18*Math.cos(t*0.27) + 10*(my-0.5);
//     const x2 = 50 + 26*Math.cos(t*0.22 + 1.3) - 12*(mx-0.5);
//     const y2 = 80 + 20*Math.sin(t*0.31 + 0.8) - 8*(my-0.5);
//     host.style.setProperty('--x1', x1.toFixed(2) + '%');
//     host.style.setProperty('--y1', y1.toFixed(2) + '%');
//     host.style.setProperty('--x2', x2.toFixed(2) + '%');
//     host.style.setProperty('--y2', y2.toFixed(2) + '%');
//   }

//   function tick(){
//     t += 0.016;
//     update();
//     raf = requestAnimationFrame(tick);
//   }

//   if (!reduce){
//     tick();
//     window.addEventListener('mousemove', (e) => {
//       const { innerWidth:w, innerHeight:h } = window;
//       mx += ((e.clientX / w) - mx) * 0.08;
//       my += ((e.clientY / h) - my) * 0.08;
//     }, { passive:true });
//   } else {
//     update();
//   }
// })();


/* 7) Cursor dot branco (desktop) */
(function(){
  if (matchMedia('(hover: none)').matches) return; // não exibe em touch

  const dot = document.createElement('span');
  dot.className = 'cursor-dot hide';
  document.body.appendChild(dot);

  let x = innerWidth/2,  y = innerHeight/2;   // posição atual (suavizada)
  let tx = x,            ty = y;              // alvo (cursor)
  const ease = 0.18;                          // suavização da “perseguição”
  let raf;

  const loop = () => {
    x += (tx - x) * ease;
    y += (ty - y) * ease;
    dot.style.setProperty('--tx', x.toFixed(2) + 'px');
    dot.style.setProperty('--ty', y.toFixed(2) + 'px');
    raf = requestAnimationFrame(loop);
  };

  // mover alvo
  window.addEventListener('mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
    dot.classList.remove('hide');
  }, { passive: true });

  // esconder/mostrar ao sair/entrar da janela
  window.addEventListener('mouseleave', () => dot.classList.add('hide'));
  window.addEventListener('mouseenter', () => dot.classList.remove('hide'));

  // pulso no clique
  window.addEventListener('mousedown', () => dot.classList.add('pulse'));
  window.addEventListener('mouseup',   () => dot.classList.remove('pulse'));

  // destacar quando passar por áreas clicáveis
  const hoverables = ['a','button','.btn','.mini-btn','.chip','[role="button"]'];
  document.addEventListener('mouseover', (e) => {
    if (hoverables.some(sel => e.target.closest(sel))) dot.classList.add('active');
  });
  document.addEventListener('mouseout', (e) => {
    if (hoverables.some(sel => e.target.closest(sel))) dot.classList.remove('active');
  });

  // inicia
  loop();
})();

// pausa/resume global por visibilidade
(function(){
  const pausers = [];
  window.__registerPauseable = (ops) => pausers.push(ops); // {start, stop}

  document.addEventListener('visibilitychange', () => {
    pausers.forEach(p => document.hidden ? p.stop?.() : p.start?.());
  });
})();
