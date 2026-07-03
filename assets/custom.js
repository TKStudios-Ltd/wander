/*
* Palo Alto Theme
*
* Use this file to add custom Javascript to Palo Alto.
*/

(function () {
  /*
  ------------------------------------------------------------
  Close custom success popups
  ------------------------------------------------------------
  */

  function closeSuccessPopup() {
    document.querySelectorAll('.form-success.popup-success').forEach(function (popup) {
      popup.remove();
    });

    document.querySelectorAll('.newsletter-popup-overlay, .contact-popup-overlay').forEach(function (overlay) {
      overlay.remove();
    });
  }

  document.addEventListener('click', function (event) {
    if (
      event.target.closest('.form-success.popup-success .icon-close') ||
      event.target.closest('.newsletter-popup-overlay') ||
      event.target.closest('.contact-popup-overlay')
    ) {
      closeSuccessPopup();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeSuccessPopup();
    }
  });
})();



/*
------------------------------------------------------------
Tabs
------------------------------------------------------------
*/

class TabsComponent extends HTMLElement {
  constructor() {
    super();

    this.querySelectorAll('.tab-link').forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();

        const target = e.target.getAttribute('href');

        this.querySelectorAll('.tab-link').forEach((link) => {
          link.classList.remove('active');
        });

        this.querySelectorAll('.tab-content').forEach((content) => {
          content.classList.remove('active');
        });

        e.target.classList.add('active');

        const targetEl = this.querySelector(target);
        if (targetEl) {
          targetEl.classList.add('active');
        }
      });
    });
  }
}

if (!customElements.get('tabs-component')) {
  customElements.define('tabs-component', TabsComponent);
}



/*
------------------------------------------------------------
Theme popups + newsletter success popup
------------------------------------------------------------
*/

(function () {
  const NEWSLETTER_SUCCESS_POPUP_ID = 'popup--popup_with_image_haEQhW';

  function closeThemePopups() {
    document.querySelectorAll('[data-popup]').forEach(function (wrapper) {
      wrapper.classList.remove('popup--visible', 'is-active', 'open', 'active');
      wrapper.style.display = 'none';
      wrapper.setAttribute('aria-hidden', 'true');
    });

    document.querySelectorAll('.popup').forEach(function (popup) {
      popup.classList.remove('popup--visible', 'is-active', 'open', 'active');
      popup.style.display = 'none';
      popup.setAttribute('aria-hidden', 'true');
      popup.setAttribute('hidden', '');
    });

    document.body.classList.remove(
      'popup-open',
      'notification-visible',
      'js-drawer-open',
      'js-drawer-open-lock',
      'scroll-lock',
      'no-scroll',
      'overflow-hidden'
    );
  }

  function openPopupById(id) {
    closeThemePopups();

    const popup = document.getElementById(id);

    if (!popup) {
      console.warn('[Popup Debug] no #' + id);
      return;
    }

    const wrapper = popup.closest('[data-popup]');

    if (wrapper) {
      wrapper.style.display = '';
      wrapper.classList.add('popup--visible', 'is-active', 'open');
      wrapper.removeAttribute('hidden');
      wrapper.setAttribute('aria-hidden', 'false');
    }

    popup.style.display = '';
    popup.classList.add('popup--visible', 'is-active', 'open');
    popup.removeAttribute('hidden');
    popup.setAttribute('aria-hidden', 'false');

    document.body.classList.add('notification-visible', 'popup-open');
  }

  // Open popup links, e.g. <a href="#popup--example">
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href^="#popup--"]');
    if (!link) return;

    e.preventDefault();

    const popupId = link.getAttribute('href').slice(1);
    openPopupById(popupId);
  });

  // Close popup
  document.addEventListener('click', function (e) {
    if (
      e.target.closest('[data-popup-close]') ||
      e.target.closest('[data-popup-underlay]') ||
      e.target.closest('.popup__close') ||
      e.target.closest('.popup__close__button')
    ) {
      e.preventDefault();
      closeThemePopups();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeThemePopups();
    }
  });

  // Newsletter success redirect
  window.addEventListener('load', function () {
    const params = new URLSearchParams(window.location.search);

    if (params.get('customer_posted') === 'true') {
      setTimeout(function () {
        openPopupById(NEWSLETTER_SUCCESS_POPUP_ID);
      }, 300);
    }
  });
})();



/*
------------------------------------------------------------
Back to top
------------------------------------------------------------
*/

function initBackToTop() {
  document.querySelectorAll('.back-to-top').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', initBackToTop);
document.addEventListener('shopify:section:load', initBackToTop);
document.addEventListener('page:load', initBackToTop);



/*
------------------------------------------------------------
Copyright popup trigger
------------------------------------------------------------
*/

(function () {
  var TRIGGER_SELECTOR = '.js-copyright-trigger';
  var POPUP_WRAPPER_SELECTOR = '[data-popup][data-manual-trigger-id="copyright_open"]';

  function init() {
    var trigger = document.querySelector(TRIGGER_SELECTOR);
    if (!trigger) return;

    var wrapper = document.querySelector(POPUP_WRAPPER_SELECTOR);
    if (!wrapper) return;

    var popup = wrapper.querySelector('.popup[id]');
    if (!popup) return;

    trigger.setAttribute('href', '#' + popup.id);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();



/*
------------------------------------------------------------
Scroll down section
------------------------------------------------------------
*/

(function () {
  const scrollButton = document.getElementById('scroll-next');
  if (!scrollButton) return;

  scrollButton.addEventListener('click', function (e) {
    e.preventDefault();

    const currentSection = this.closest('.shopify-section');
    const nextSection = currentSection?.nextElementSibling;

    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
})();