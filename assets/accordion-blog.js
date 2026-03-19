document.addEventListener('DOMContentLoaded', () => {
 
  const CHEVRON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;
 
  document.querySelectorAll('.hl-article__accordion-wrapper').forEach(wrapper => {
 
    // Inject toggle button into title wrapper
    const titleWrapper = wrapper.querySelector('.hl-article__accordion-title-wrapper');
    const btn = document.createElement('button');
    btn.className = 'hl-article__accordion-toggle';
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = CHEVRON_SVG;
    titleWrapper.appendChild(btn);
 
    // Click handler
    titleWrapper.addEventListener('click', () => {
      const isOpen = wrapper.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
 
  });
 
});
 