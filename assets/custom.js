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
Newsletter success popup only
------------------------------------------------------------
*/

(function () {
  const NEWSLETTER_SUCCESS_POPUP_ID = 'popup--popup_with_image_haEQhW';

  function openNewsletterPopup() {
    const popup = document.getElementById(NEWSLETTER_SUCCESS_POPUP_ID);

    if (!popup) {
      console.warn('[Newsletter Popup] Could not find #' + NEWSLETTER_SUCCESS_POPUP_ID);
      return;
    }

    const wrapper = popup.closest('[data-popup]');

    popup.removeAttribute('hidden');
    popup.removeAttribute('aria-hidden');
    popup.classList.add('popup--visible');

    if (wrapper) {
      wrapper.removeAttribute('hidden');
      wrapper.removeAttribute('aria-hidden');
      wrapper.classList.add('popup--visible', 'is-active', 'open');
    }

    document.body.classList.add('notification-visible');
  }

  window.addEventListener('load', function () {
    const params = new URLSearchParams(window.location.search);

    if (params.get('customer_posted') === 'true') {
      setTimeout(openNewsletterPopup, 500);
      setTimeout(openNewsletterPopup, 1000);
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