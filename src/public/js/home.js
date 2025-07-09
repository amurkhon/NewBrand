anime.timeline({ easing: 'easeOutExpo', duration: 1200 })
  .add({
    targets: '.navigation-menu',
    opacity: [0, 1],
    translateY: [-20, 0]
  })
  .add({
    targets: '.hero-title',
    opacity: [0, 1],
    translateY: [30, 0]
  }, '-=800')
  .add({
    targets: '.hero-subtitle',
    opacity: [0, 1],
    translateY: [30, 0]
  }, '-=1000')
  .add({
    targets: '.cta-btn',
    opacity: [0, 1],
    scale: [0.9, 1]
  }, '-=1000');
