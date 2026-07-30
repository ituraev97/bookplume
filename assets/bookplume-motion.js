(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  revealEls.forEach(function (el, i) {
    var group = el.closest('[data-reveal-group]');
    var index = group ? Array.prototype.indexOf.call(group.querySelectorAll('[data-reveal]'), el) : i;
    if (!el.style.getPropertyValue('--bp-reveal-delay')) {
      el.style.setProperty('--bp-reveal-delay', Math.min(index * 70, 420) + 'ms');
    }
  });

  if (reduceMotion) {
    revealEls.forEach(function (el) {
      el.classList.add('is-revealed');
    });
  } else if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-revealed');
    });
  }

  /* ---------- Header scroll state ---------- */
  var headerWrapper = document.querySelector('.header-wrapper');
  var ticking = false;
  var onScrollTasks = [];

  function runScrollTasks() {
    onScrollTasks.forEach(function (task) {
      task();
    });
    ticking = false;
  }

  function queueScroll() {
    if (!ticking) {
      window.requestAnimationFrame(runScrollTasks);
      ticking = true;
    }
  }

  if (headerWrapper) {
    var updateScrolled = function () {
      headerWrapper.classList.toggle('bp-scrolled', window.scrollY > 8);
    };
    updateScrolled();
    onScrollTasks.push(updateScrolled);
  }

  /* ---------- Subtle parallax (hero floating covers) ---------- */
  var parallaxEls = document.querySelectorAll('[data-parallax-speed]');
  if (parallaxEls.length && !reduceMotion) {
    var updateParallax = function () {
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0;
        var offset = Math.max(-40, Math.min(40, window.scrollY * speed));
        el.style.setProperty('--bp-parallax-y', offset + 'px');
      });
    };
    updateParallax();
    onScrollTasks.push(updateParallax);
  }

  /* ---------- Sticky scroll storytelling ---------- */
  /* Small viewports skip the sticky pin-and-swap in favour of a plain
     stacked list — scroll-jacking a tall element is a poor fit for phones,
     and this keeps all the story content readable without relying on a
     scroll-distance calculation that doesn't hold up at that size. */
  var isNarrowViewport = window.matchMedia('(max-width: 749px)').matches;
  var storySections = document.querySelectorAll('[data-story]');
  storySections.forEach(function (section) {
    var textEls = section.querySelectorAll('[data-story-text]');
    var mediaEls = section.querySelectorAll('[data-story-media]');
    if (!textEls.length) return;

    if (reduceMotion || isNarrowViewport) {
      section.classList.add('bp2-story--static');
      textEls.forEach(function (el) { el.classList.add('is-active'); });
      mediaEls.forEach(function (el) { el.classList.add('is-active'); });
      return;
    }

    var activeIndex = -1;
    var setActive = function () {
      var rect = section.getBoundingClientRect();
      var viewportH = window.innerHeight;
      var total = rect.height - viewportH;
      var progress = total > 0 ? (-rect.top) / total : 0;
      progress = Math.max(0, Math.min(1, progress));
      var index = Math.min(textEls.length - 1, Math.floor(progress * textEls.length));
      if (index !== activeIndex) {
        textEls.forEach(function (el, i) { el.classList.toggle('is-active', i === index); });
        mediaEls.forEach(function (el, i) { el.classList.toggle('is-active', i === index); });
        activeIndex = index;
      }
    };
    setActive();
    onScrollTasks.push(setActive);
  });

  if (onScrollTasks.length) {
    window.addEventListener('scroll', queueScroll, { passive: true });
    window.addEventListener('resize', queueScroll, { passive: true });
  }

  /* ---------- Horizontal rail controls ---------- */
  document.querySelectorAll('[data-rail]').forEach(function (rail) {
    var track = rail.querySelector('[data-rail-track]');
    if (!track) return;
    var prev = rail.querySelector('[data-rail-prev]');
    var next = rail.querySelector('[data-rail-next]');
    var scrollByAmount = function (dir) {
      var item = track.querySelector('[data-rail-item]');
      var amount = item ? item.getBoundingClientRect().width + 32 : track.clientWidth * 0.8;
      track.scrollBy({ left: dir * amount, behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    if (prev) prev.addEventListener('click', function () { scrollByAmount(-1); });
    if (next) next.addEventListener('click', function () { scrollByAmount(1); });
  });
})();
