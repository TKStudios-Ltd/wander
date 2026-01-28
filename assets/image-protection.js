(() => {
  const MESSAGE = '© All rights reserved. Image saving is disabled on this website.';

  // Limit protection to main site content so it doesn't break header icons, etc.
  const ROOT_SELECTOR = 'main';

  function ensureToast() {
    let el = document.getElementById('image-protection-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'image-protection-toast';
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

  function inRoot(target) {
    return !!(target && target.closest && target.closest(ROOT_SELECTOR));
  }

  function isProtectedImageTarget(target) {
    if (!target) return false;

    // If you right click on an image or its wrappers
    if (target.closest && target.closest('img, picture, svg, canvas')) return true;

    // If you right click on a div with a background-image (common in galleries)
    const el = target.closest && target.closest('div, figure, a, span, section, article, li');
    if (el) {
      const cs = window.getComputedStyle(el);
      if (cs && cs.backgroundImage && cs.backgroundImage !== 'none') return true;
    }

    return false;
  }

  function block(e) {
    if (!inRoot(e.target)) return;
    if (!isProtectedImageTarget(e.target)) return;

    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();

    showToast(MESSAGE);
    return false;
  }

  // Capture phase so we win against other listeners
  document.addEventListener('contextmenu', block, true);
  document.addEventListener('dragstart', block, true);

  // Extra friction: make imgs non-draggable (helps some browsers)
  function markImages() {
    document.querySelectorAll(`${ROOT_SELECTOR} img`).forEach((img) => {
      img.setAttribute('draggable', 'false');
      img.style.userSelect = 'none';
      img.style.webkitUserSelect = 'none';
      img.style.webkitUserDrag = 'none';
    });
  }

  document.addEventListener('DOMContentLoaded', markImages);
  markImages();

  // Support AJAX renders (collection filters, quick view, etc.)
  const obs = new MutationObserver(() => markImages());
  obs.observe(document.documentElement, { childList: true, subtree: true });
})();
