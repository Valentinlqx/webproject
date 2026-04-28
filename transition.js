(function () {
  const links = document.querySelectorAll('a[data-transition]');

  links.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const href = this.getAttribute('href');
      const bgImage = this.getAttribute('data-transition');

      const overlay = document.createElement('div');
      overlay.className = 'page-transition';
      overlay.style.backgroundImage =
        "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(40, 50, 70, 0.4), transparent 70%), url('" + bgImage + "')";
      document.body.appendChild(overlay);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          overlay.classList.add('slide-up');
        });
      });

      setTimeout(() => {
        window.location.href = href;
      }, 900);
    });
  });
})();
