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
Theme/manual popups + newsletter success popup
------------------------------------------------------------
*/

(function () {
  const NEWSLETTER_SUCCESS_TRIGGER_ID = 'popup-0';

  function closeThemePopups() {
    document.querySelectorAll('[data-popup]').forEach(function (wrapper) {
      wrapper.classList.remove('popup--visible', 'is-active', 'open', 'active');
      wrapper.setAttribute('aria-hidden', 'true');
    });

    document.querySelectorAll('.popup').forEach(function (popup) {
      popup.classList.remove('popup--visible', 'is-active', 'open', 'active');
      popup.setAttribute('aria-hidden', 'true');
      popup.setAttribute('hidden', '');
      popup.style.display = '';
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

  function findPopup(target) {
    let popup = document.getElementById('popup--' + target) || document.getElementById(target);

    if (popup) {
      return popup;
    }

    const wrapper = document.querySelector('[data-popup][data-manual-trigger-id="' + target + '"]');

    if (wrapper) {
      return wrapper.querySelector('.popup');
    }

    return null;
  }

  function openPopup(target) {
    const popup = findPopup(target);

    if (!popup) {
      console.warn('[Popup Debug] no popup for:', target);
      return;
    }

    closeThemePopups();

    const wrapper = popup.closest('[data-popup]');

    if (wrapper) {
      wrapper.classList.add('popup--visible', 'is-active', 'open');
      wrapper.removeAttribute('hidden');
      wrapper.setAttribute('aria-hidden', 'false');
    }

    popup.classList.add('popup--visible', 'is-active', 'open');
    popup.removeAttribute('hidden');
    popup.removeAttribute('aria-hidden');
    popup.style.display = '';

    document.body.classList.add('notification-visible', 'popup-open');
  }

  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href^="#popup--"]');
    if (!link) return;

    e.preventDefault();

    const target = link.getAttribute('href').replace('#popup--', '');
    openPopup(target);
  });

  document.addEventListener('click', function (e) {
    if (
      e.target.closest('[data-popup-close]') ||
      e.target.closest('[data-popup-underlay]') ||
      e.target.closest('.popup__close')
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

  window.addEventListener('load', function () {
    const params = new URLSearchParams(window.location.search);

    if (params.get('customer_posted') === 'true') {
      setTimeout(function () {
        openPopup(NEWSLETTER_SUCCESS_TRIGGER_ID);
      }, 500);
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