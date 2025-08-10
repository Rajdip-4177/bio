(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

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

  // IntersectionObserver to highlight TOC
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) setActiveToc(e.target.id);
    });
  }, {rootMargin: '0px 0px -70% 0px', threshold: 0.1});

  sections.forEach(sec => io.observe(sec));

  // Smooth scroll for TOC
  tocLinks.forEach(a => {
    a.addEventListener('click', (ev) => {
      const id = a.getAttribute('href').slice(1);
      const sec = document.getElementById(id);
      if (sec){
        ev.preventDefault();
        // Ensure visible if collapsed
        sec.setAttribute('aria-expanded','true');
        sec.scrollIntoView({behavior:'smooth', block:'start'});
        history.replaceState(null, '', `#${id}`);
      }
    });
  });

  // Expand/Collapse all
  const expandBtn = $('[data-action="expand-all"]');
  const collapseBtn = $('[data-action="collapse-all"]');
  const printBtn = $('[data-action="print"]');

  function toggleAll(expand){
    sections.forEach(sec => {
      // keep the hero and immediate intro always expanded when expanding
      if (expand) {
        sec.setAttribute('aria-expanded','true');
      } else {
        // Collapse only top-level .section that are not the first intro
        if (sec.id && sec.id !== 'intro') sec.setAttribute('aria-expanded','false');
      }
    });
    window.scrollTo({top:0, behavior:'smooth'});
  }

  expandBtn?.addEventListener('click', () => toggleAll(true));
  collapseBtn?.addEventListener('click', () => toggleAll(false));
  printBtn?.addEventListener('click', () => window.print());

  // Allow header click to toggle the immediate section
  $$('.section > h3, .section > h4').forEach(h =>{
    h.style.cursor = 'pointer';
    h.addEventListener('click', () => {
      const section = h.closest('.section');
      const expanded = section.getAttribute('aria-expanded') !== 'false';
      section.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
  });

  // Keyboard accessibility for buttons
  $$('.actions button').forEach(btn =>{
    btn.setAttribute('tabindex','0');
    btn.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' || e.key === ' ') btn.click();
    });
  });
})();