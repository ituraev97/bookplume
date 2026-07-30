(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var revealEls = document.querySelectorAll('[data-reveal]');
  revealEls.forEach(function (el, i) {
    var group = el.closest('[data-reveal-group]');
    var index = group ? Array.prototype.indexOf.call(group.querySelectorAll('[data-reveal]'), el) : i;
    el.style.setProperty('--bp-reveal-delay', Math.min(index * 70, 420) + 'ms');
  });

  if (reduceMotion) {
    revealEls.forEach(function (el) {
      el.classList.add('is-revealed');
    });
  } else if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-revealed');
    });
  }

  var headerWrapper = document.querySelector('.header-wrapper');
  if (headerWrapper) {
    var ticking = false;
    var updateScrolled = function () {
      headerWrapper.classList.toggle('bp-scrolled', window.scrollY > 8);
      ticking = false;
    };
    updateScrolled();
    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          window.requestAnimationFrame(updateScrolled);
          ticking = true;
        }
      },
      { passive: true }
    );
  }
})();
