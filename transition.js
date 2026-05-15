(function () {
  const links = document.querySelectorAll('a[data-transition]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  links.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const href = this.getAttribute('href');

      if (reduceMotion) {
        window.location.href = href;
        return;
      }

      const bgValue = this.getAttribute('data-transition');

      const overlay = document.createElement('div');
      overlay.className = 'page-transition';
      // data-transition can be a CSS color (e.g. #FFD60A) or an image path.
      if (bgValue && /^(#|rgb|hsl)/.test(bgValue.trim())) {
        overlay.style.backgroundColor = bgValue;
        overlay.style.backgroundImage = 'none';
      } else {
        overlay.style.backgroundImage =
          "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(91, 126, 60, 0.4), transparent 70%), url('" + bgValue + "')";
      }
      document.body.appendChild(overlay);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          overlay.classList.add('slide-up');
        });
      });

      setTimeout(() => {
        window.location.href = href;
      }, 600);
    });
  });
})();
