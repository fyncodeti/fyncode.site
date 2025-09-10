// ano no rodapé
document.getElementById('year').textContent = new Date().getFullYear();

// menu mobile
const btn = document.getElementById('menuBtn');
const sheet = document.getElementById('sheet');
const closeSheet = document.getElementById('closeSheet');

function toggleMenu(open){
  const willOpen = (typeof open === 'boolean') ? open : !sheet.classList.contains('open');
  sheet.classList.toggle('open', willOpen);
  btn.classList.toggle('active', willOpen);
  if (closeSheet) closeSheet.classList.toggle('active', willOpen);
  btn.setAttribute('aria-expanded', String(willOpen));
  sheet.setAttribute('aria-hidden', String(!willOpen));
}
btn.addEventListener('click', () => toggleMenu());
if (closeSheet) closeSheet.addEventListener('click', () => toggleMenu(false));
document.addEventListener('click', (e)=>{
  if(!sheet.classList.contains('open')) return;
  const inside = sheet.contains(e.target) || btn.contains(e.target);
  if(!inside) toggleMenu(false);
});
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') toggleMenu(false) });

// scroll suave com offset do header
const HEADER_OFFSET = 78;
function smoothScrollTo(id){
  const el = document.querySelector(id);
  if(!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top: y, behavior: 'smooth' });
}
document.querySelectorAll('[data-scroll]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href');
    if(href && href.startsWith('#')){
      e.preventDefault();
      smoothScrollTo(href);
      toggleMenu(false);
    }
  });
});

// scrollspy (destaca link ativo)
const sections = [...document.querySelectorAll('section[id]')];
const links = [...document.querySelectorAll('.nav-link')];
const obs = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const id = entry.target.id;
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
    }
  });
},{
  rootMargin: `-${HEADER_OFFSET + 10}px 0px -50% 0px`,
  threshold: 0.1
});
sections.forEach(sec => obs.observe(sec));
