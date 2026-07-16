(() => {
  'use strict';

  const progress = document.querySelector('[data-reading-progress]');
  const fill = progress?.querySelector('span');
  if (!progress || !fill) return;

  let frameRequested = false;

  const update = () => {
    const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollRange > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollRange)) : 1;
    fill.style.transform = `scaleY(${ratio})`;
    progress.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
    frameRequested = false;
  };

  const requestUpdate = () => {
    if (frameRequested) return;
    window.requestAnimationFrame(update);
    frameRequested = true;
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  update();
})();
