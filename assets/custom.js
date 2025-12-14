/*
* Palo Alto Theme
*
* Use this file to add custom Javascript to Palo Alto.  Keeping your custom
* Javascript in this fill will make it easier to update Palo Alto. In order
* to use this file you will need to open layout/theme.liquid and uncomment
* the custom.js script import line near the bottom of the file.
*/


(function() {
  // Add custom code below this line


  const popupToggle = () => {
    const popupCtr = document.querySelector('.popup-success');
    const popupCtrOverlay = document.querySelector('.newsletter-popup-overlay');
    const popupCloseBtn = document.querySelector('.newsletter-section .form-success.popup-success .icon-close');
  
    if (sessionStorage.getItem('popupClosed') === 'true') {
      popupCtr?.remove();
      popupCtrOverlay?.remove();
      return;
    }
  
    const closePopup = () => {
      popupCtr?.remove();
      popupCtrOverlay?.remove();
      sessionStorage.setItem('popupClosed', 'true')
    };
  
    popupCtrOverlay?.addEventListener('click', closePopup);
    popupCloseBtn?.addEventListener('click', closePopup);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closePopup();
      }
    });
  }
  
  popupToggle();

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
  console.log('[Popup Debug] loader');

  function openPopupById(id) {
    const popup = document.getElementById(id);
    if (!popup) return console.warn('[Popup Debug] no #'+id);

    // Some themes wrap the popup inside a [data-popup] holder
    const holder = popup.closest('[data-popup]');

    // Make sure any “hide popups while notification shown” class is removed
    if (document.body.classList.contains('notification-visible')) {
      document.body.classList.remove('notification-visible');
    }

    // Theme expects .popup--visible on the .popup element
    popup.classList.add('popup--visible');
    popup.removeAttribute('hidden');
    popup.style.display = 'block';
    popup.setAttribute('aria-hidden', 'false');

    // Some themes also want holder flags (harmless if no-op)
    if (holder) holder.classList.add('popup--visible', 'is-active', 'open');

    document.body.classList.add('popup-open');
  }

  function closeAllPopups() {
    document.querySelectorAll('.popup.popup--visible').forEach(p => {
      p.classList.remove('popup--visible', 'is-active', 'open', 'active');
      p.style.display = '';
      p.setAttribute('aria-hidden', 'true');
    });
    document.querySelectorAll('[data-popup]').forEach(h => {
      h.classList.remove('popup--visible', 'is-active', 'open', 'active');
    });
    document.body.classList.remove('popup-open');
  }

  // Open when clicking links like #popup--popup-0
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href^="#popup--"]');
    if (!link) return;
    e.preventDefault();
    const id = link.getAttribute('href').slice(1);
    openPopupById(id);
  });

  // Close on underlay or close button
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-popup-close]') || e.target.closest('[data-popup-underlay]')) {
      e.preventDefault();
      closeAllPopups();
    }
  });

  // ESC to close
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllPopups();
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

  function getPopup() {
    var wrapper = document.querySelector(POPUP_WRAPPER_SELECTOR);
    if (!wrapper) return null;
    return wrapper.querySelector('.popup[id]');
  }

  function openPopup(a) {
    var popup = getPopup();
    if (!popup) return;

    a.setAttribute('href', '#' + popup.id);

    setTimeout(function () {
      a.click();
    }, 0);
  }

  function closePopup() {
    var popup = getPopup();
    if (!popup) return;

    popup.classList.remove('popup--visible');
    popup.style.display = '';

    document.body.classList.remove('notification-visible');

    history.pushState(
      '',
      document.title,
      window.location.pathname + window.location.search
    );
  }

  document.addEventListener(
    'click',
    function (e) {
      var a = e.target.closest(TRIGGER_SELECTOR);
      if (!a) return;

      e.preventDefault();
      openPopup(a);
    },
    true
  );

  document.addEventListener(
    'click',
    function (e) {
      if (
        e.target.closest('[data-popup-close]') ||
        e.target.closest('[data-popup-underlay]')
      ) {
        closePopup();
      }
    },
    true
  );

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closePopup();
    }
  });
})();

