// assets/image-protection.js
(() => {
  const SELECTOR = 'main img, .product__media img, .article-template img, .collection img, .rte img';
  const MESSAGE = '© All rights reserved. Image saving is disabled on this website.';

  function ensureToast() {
    let el = document.getElementById('tk-image-protection-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'tk-image-protection-toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    return el;
  }

  function showToast(text) {
    const el = ensureToast();
    el.textContent = text;
    el.classList.add('is-visible');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => el.classList.remove('is-visible'), 2200);
  }

  function isInsideAllowedUI(target) {
    // Let users interact with inputs/buttons/links etc
    return !!target.closest('a, button, input, textarea, select, summary, details, [role="button"]');
  }

  function shouldProtect(target) {
    if (!target) return false;
    if (isInsideAllowedUI(target)) return false;
    const img = target.closest('img');
    if (!img) return false;
    // only protect images in main content areas (avoid icons/logos if you want)
    return img.matches(SELECTOR);
  }

  // Block right-click context menu on protected images
  document.addEventListener(
    'contextmenu',
    (e) => {
      if (!shouldProtect(e.target)) return;
      e.preventDefault();
      showToast(MESSAGE);
    },
    { capture: true }
  );

  // Block drag (drag-to-desktop/save)
  document.addEventListener(
    'dragstart',
    (e) => {
      if (!shouldProtect(e.target)) return;
      e.preventDefault();
      showToast(MESSAGE);
    },
    { capture: true }
  );

  // Optional: block long-press save on some mobile browsers (limited effectiveness)
  document.addEventListener(
    'touchstart',
    (e) => {
      if (!shouldProtect(e.target)) return;
      const target = e.target;
      target.dataset.tkTouchStart = String(Date.now());
    },
    { passive: true, capture: true }
  );

  document.addEventListener(
    'touchend',
    (e) => {
      const img = e.target && e.target.closest && e.target.closest('img');
      if (!img || !img.matches(SELECTOR)) return;
      const started = Number(img.dataset.tkTouchStart || 0);
      if (started && Date.now() - started > 550) {
        showToast(MESSAGE);
      }
    },
    { passive: true, capture: true }
  );
})();
