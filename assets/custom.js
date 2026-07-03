/*
* Palo Alto Theme
*
* Use this file to add custom Javascript to Palo Alto.  Keeping your custom
* Javascript in this fill will make it easier to update Palo Alto. In order
* to use this file you will need to open layout/theme.liquid and uncomment
* the custom.js script import line near the bottom of the file.
*/


(function() {
  // Close custom success popups

  const closeSuccessPopup = () => {
    document.querySelectorAll('.form-success.popup-success').forEach(popup => {
      popup.remove();
    });

    document.querySelectorAll('.newsletter-popup-overlay, .contact-popup-overlay').forEach(overlay => {
      overlay.remove();
    });
  };

  document.addEventListener('click', (event) => {
    if (
      event.target.closest('.form-success.popup-success .icon-close') ||
      event.target.closest('.newsletter-popup-overlay') ||
      event.target.closest('.contact-popup-overlay')
    ) {
      closeSuccessPopup();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSuccessPopup();
    }
  });

})();

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
        this.querySelector(target).classList.add('active');
      });
    });
  }

}
customElements.define('tabs-component', TabsComponent);




(function () {

  function openPopupById(id) {
    const popup = document.getElementById(id);
    if (!popup) return console.warn('[Popup Debug] no #' + id);

    const holder = popup.closest('[data-popup]');

    document.body.classList.remove('notification-visible');

    popup.classList.add('popup--visible');
    popup.removeAttribute('hidden');
    popup.style.display = 'block';
    popup.setAttribute('aria-hidden', 'false');

    if (holder) {
      holder.classList.add('popup--visible', 'is-active', 'open');
    }

    document.body.classList.add('popup-open');
  }

  function closeAllPopups() {
    document.querySelectorAll('.popup').forEach(p => {
      p.classList.remove('popup--visible', 'is-active', 'open', 'active');
      p.style.display = '';
      p.setAttribute('aria-hidden', 'true');
    });

    document.querySelectorAll('[data-popup]').forEach(h => {
      h.classList.remove('popup--visible', 'is-active', 'open', 'active');
      h.style.display = '';
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

  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href^="#popup--"]');
    if (!link) return;

    e.preventDefault();
    openPopupById(link.getAttribute('href').slice(1));
  });

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-popup-close]') || e.target.closest('[data-popup-underlay]')) {
      e.preventDefault();
      closeAllPopups();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAllPopups();
    }
  });

  // Re-open the popup after successful newsletter submit
  window.addEventListener('load', function () {
    const params = new URLSearchParams(window.location.search);

    if (
      params.get('customer_posted') === 'true' &&
      window.location.hash === '#NewsletterForm--popup-0'
    ) {
      openPopupById('popup--popup_with_image_haEQhW');
    }
  });

})();


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

// Standard load
document.addEventListener('DOMContentLoaded', initBackToTop);

// For Shopify themes using Turbo / AJAX page transitions
document.addEventListener('shopify:section:load', initBackToTop);
document.addEventListener('page:load', initBackToTop); // for Turbo




(function() {
  // --- OPEN POPUP PROGRAMMATICALLY ---------------------------------
  function openPopupEl(wrapper) {
    if (!wrapper) return;

    // find the inner popup node
    var popupEl = wrapper.querySelector('.popup');
    if (!popupEl) return;

    // show popup
    popupEl.classList.add('popup--visible');

    // lock body / prevent background scroll (theme convention)
    document.body.classList.add('notification-visible');
  }

  // listen for manual trigger events like:
  // window.dispatchEvent(new CustomEvent('openPopup', { detail: 'newsletter_thank_you' }));
  window.addEventListener('openPopup', function(e) {
    var triggerId = e.detail;
    if (!triggerId) return;

    // match popup block with the same manual trigger id
    var selector = '[data-popup][data-manual-trigger-id="' + triggerId + '"]';
    var popupWrapper = document.querySelector(selector);

    if (popupWrapper) {
      openPopupEl(popupWrapper);
    }
  });

  // prevent auto-open on "manual only" popups
  document.querySelectorAll('[data-popup][data-manual-only="true"]').forEach(function(p) {
    p.setAttribute('data-popup-delay', '');
  });


  // --- NEWSLETTER SUCCESS HANDLER ---------------------------------
  // This part is ONLY needed if you want to open the popup
  // after a successful AJAX newsletter submit instead of on click.
  document.addEventListener('submit', function(e) {
    var form = e.target;

    // only catch newsletter forms you care about
    if (!form.matches('[data-newsletter-form]')) return;

    // At this point the form is being submitted.
    // For themes that AJAX-submit and stay on page:
    // after the theme finishes and shows "success", we fire popup.
    setTimeout(function() {
      var successMsg = form.querySelector(
        '[data-newsletter-success], .form-status--success, .newsletter-form__message--success'
      );

      if (successMsg) {
        window.dispatchEvent(new CustomEvent('openPopup', { detail: 'newsletter_thank_you' }));
      }
    }, 500);
  }, true);
})();


/* Copyright */

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

    // Set href ONCE so the theme can fully manage open + close
    trigger.setAttribute('href', '#' + popup.id);
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


/* Scroll Down Section */

document.getElementById('scroll-next').addEventListener('click', function(e) {
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