(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const sidebar = $('#toc-sidebar');
  const backdrop = $('.backdrop');
  const toggleBtn = $('[data-action="toggle-nav"]');

  // Toggle drawer
  function openNav(){
    sidebar.classList.add('open');
    toggleBtn?.setAttribute('aria-expanded','true');
  }
  function closeNav(){
    sidebar.classList.remove('open');
    toggleBtn?.setAttribute('aria-expanded','false');
  }
  toggleBtn?.addEventListener('click', ()=>{
    const isOpen = sidebar.classList.contains('open');
    isOpen ? closeNav() : openNav();
  });
  backdrop?.addEventListener('click', closeNav);
  document.addEventListener('keydown', (e)=>{
    if(e.key==='Escape') closeNav();
  });

  // Enhance TOC: set active link on scroll
  const tocLinks = $$('.toc a');
  const sections = $$('.content .section[id]');

  // Initialize collapsible state attribute
  sections.forEach(sec => {
    if (!sec.hasAttribute('aria-expanded')) sec.setAttribute('aria-expanded','true');
  });

  const setActiveToc = (id) => {
    tocLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
  };

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) setActiveToc(e.target.id); });
  }, {rootMargin: '0px 0px -70% 0px', threshold: 0.1});
  sections.forEach(sec => io.observe(sec));

  // Smooth scroll for TOC
  tocLinks.forEach(a => {
    a.addEventListener('click', (ev) => {
      const id = a.getAttribute('href').slice(1);
      const sec = document.getElementById(id);
      if (sec){
        ev.preventDefault();
        sec.setAttribute('aria-expanded','true');
        sec.scrollIntoView({behavior:'smooth', block:'start'});
        history.replaceState(null, '', `#${id}`);
        closeNav();
      }
    });
  });

  // Expand/Collapse all
  const expandBtns = $$('[data-action="expand-all"]');
  const collapseBtns = $$('[data-action="collapse-all"]');
  const printBtns = $$('[data-action="print"]');

  function toggleAll(expand){
    sections.forEach(sec => {
      if (expand) sec.setAttribute('aria-expanded','true');
      else if (sec.id && sec.id !== 'intro') sec.setAttribute('aria-expanded','false');
    });
    window.scrollTo({top:0, behavior:'smooth'});
  }

  expandBtns.forEach(b=>b.addEventListener('click', () => toggleAll(true)));
  collapseBtns.forEach(b=>b.addEventListener('click', () => toggleAll(false)));
  printBtns.forEach(b=>b.addEventListener('click', () => window.print()));

  // Click heading to toggle its section
  $$('.section > h3, .section > h4').forEach(h =>{
    h.addEventListener('click', () => {
      const section = h.closest('.section');
      const expanded = section.getAttribute('aria-expanded') !== 'false';
      section.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
  });

  // Keyboard accessibility for buttons
  $$('button').forEach(btn =>{
    btn.setAttribute('tabindex','0');
    btn.addEventListener('keyup', (e) => { if (e.key === 'Enter' || e.key === ' ') btn.click(); });
  });

  // Reading progress bar
  const bar = $('.progress .bar');
  function onScroll(){
    const doc = document.documentElement;
    const top = doc.scrollTop || document.body.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    const pct = height > 0 ? (top / height) * 100 : 0;
    if (bar) bar.style.width = pct + '%';
  }
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
})();