/* ============================================================
   HVYLYA AGENCY — Main Application
   ============================================================ */

/* ── 01. GSAP Setup ──────────────────────────────────────── */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ force3D: false });
}

/* ── 02. Loader ──────────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  setTimeout(function () {
    loader.classList.add('loader--hidden');
    setTimeout(function () {
      loader.style.display = 'none';
      document.body.classList.add('loaded');
      initHeroAnimation();
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 750);
  }, 2200);
}

/* ── 03. Custom Cursor ───────────────────────────────────── */
function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  var dot = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  var mouseX = -200, mouseY = -200;
  var ringX = -200, ringY = -200;
  var isRunning = false;

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isRunning) {
      isRunning = true;
      tick();
    }
  });

  function tick() {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;

    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';

    requestAnimationFrame(tick);
  }

  var hoverTargets = document.querySelectorAll('a, button, .magnetic, .solution-card, .pain-card, .macbook, .aidev-tag');
  hoverTargets.forEach(function (el) {
    el.addEventListener('mouseenter', function () { ring.classList.add('hovering'); });
    el.addEventListener('mouseleave', function () { ring.classList.remove('hovering'); });
  });
}

/* ── 04. Navbar ──────────────────────────────────────────── */
function initNavbar() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ── 05. Mobile Menu ─────────────────────────────────────── */
function initMobileMenu() {
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── 06. Hero Ecosystem Animation ────────────────────────── */
function initEcosystemAnimation() {
  var svg = document.getElementById('eco-svg');
  if (!svg || typeof gsap === 'undefined') return;

  /* Animate connection lines */
  var lines = svg.querySelectorAll('[id^="eco-l"]');
  lines.forEach(function (line, i) {
    var len = 0;
    try { len = line.getTotalLength ? line.getTotalLength() : 0; } catch(e) {}
    if (!len) {
      /* Fallback for lines without getTotalLength */
      var x1 = parseFloat(line.getAttribute('x1') || 0);
      var y1 = parseFloat(line.getAttribute('y1') || 0);
      var x2 = parseFloat(line.getAttribute('x2') || 0);
      var y2 = parseFloat(line.getAttribute('y2') || 0);
      len = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
    }
    if (len > 0) {
      gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(line, {
        strokeDashoffset: 0,
        duration: 1.4,
        delay: 0.2 + i * 0.12,
        ease: 'power2.out'
      });
    }
  });

  /* Pop in nodes */
  var nodes = svg.querySelectorAll('[id^="eco-n"]');
  gsap.from(nodes, {
    scale: 0,
    opacity: 0,
    duration: 0.7,
    stagger: 0.15,
    delay: 0.5,
    ease: 'back.out(1.7)',
    transformOrigin: 'center center'
  });

  /* Center node fade-in */
  var centerNode = svg.querySelector('circle[r="44"]');
  if (centerNode) {
    gsap.from(centerNode, { scale: 0, opacity: 0, duration: 0.8, delay: 1.2, ease: 'back.out(1.5)', transformOrigin: 'center center' });
  }

  /* Traveling particle along the outer arc */
  var particle = document.getElementById('eco-particle');
  var outerPath = document.getElementById('eco-l1');
  if (particle && outerPath) {
    var allPaths = [
      document.getElementById('eco-l1'),
      document.getElementById('eco-l2'),
      document.getElementById('eco-l3'),
      document.getElementById('eco-l4')
    ].filter(Boolean);

    var currentPath = 0;

    function moveParticle() {
      var path = allPaths[currentPath];
      if (!path) return;
      var len = 0;
      try { len = path.getTotalLength(); } catch(e) {}
      if (!len) { currentPath = (currentPath + 1) % allPaths.length; moveParticle(); return; }

      var progress = { t: 0 };
      gsap.to(progress, {
        t: 1,
        duration: 2.2,
        ease: 'none',
        delay: currentPath === 0 ? 1.5 : 0,
        onUpdate: function () {
          try {
            var pt = path.getPointAtLength(progress.t * len);
            gsap.set(particle, { attr: { cx: pt.x, cy: pt.y } });
          } catch(e) {}
        },
        onComplete: function () {
          currentPath = (currentPath + 1) % allPaths.length;
          moveParticle();
        }
      });
    }

    moveParticle();
  }

  /* Node glow pulse */
  var nodeCircles = svg.querySelectorAll('[id^="eco-n"] circle:first-child');
  gsap.to(nodeCircles, {
    opacity: 0.3,
    scale: 1.25,
    duration: 2,
    repeat: -1,
    yoyo: true,
    stagger: { each: 0.4, from: 'random' },
    ease: 'sine.inOut',
    transformOrigin: 'center center'
  });
}

/* ── 07. Hero Entrance Animation ─────────────────────────── */
function initHeroAnimation() {
  if (typeof gsap === 'undefined') return;

  var elements = [
    document.querySelector('.hero-eyebrow'),
    document.querySelector('.hero-title'),
    document.querySelector('.hero-sub'),
    document.querySelector('.hero-ctas'),
    document.querySelector('.hero-stats')
  ].filter(Boolean);

  gsap.fromTo(elements,
    { y: 48, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power3.out' }
  );

  /* Hero visual */
  var heroVisual = document.getElementById('heroVisual');
  if (heroVisual) {
    gsap.fromTo(heroVisual,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, delay: 0.3, ease: 'power3.out' }
    );
  }

  /* Start ecosystem animation */
  initEcosystemAnimation();
}

/* ── 08. Scroll Animations ───────────────────────────────── */
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    /* Fallback: use IntersectionObserver */
    initScrollFallback();
    return;
  }

  /* Section eyebrows */
  gsap.utils.toArray('.section-eyebrow').forEach(function (el) {
    gsap.fromTo(el,
      { x: -24, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
      }
    );
  });

  /* Section titles */
  gsap.utils.toArray('.section-title').forEach(function (el) {
    gsap.fromTo(el,
      { y: 36, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      }
    );
  });

  /* Section bodies */
  gsap.utils.toArray('.section-body').forEach(function (el) {
    gsap.fromTo(el,
      { y: 24, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%' }
      }
    );
  });

  /* Pain cards stagger */
  var painCards = document.querySelectorAll('.pain-card');
  if (painCards.length) {
    gsap.fromTo(painCards,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: '.problem-cards', start: 'top 80%' }
      }
    );
  }

  /* Solution cards stagger */
  var solutionCards = document.querySelectorAll('.solution-card');
  if (solutionCards.length) {
    gsap.fromTo(solutionCards,
      { y: 48, opacity: 0, scale: 0.97 },
      {
        y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.solutions-grid', start: 'top 80%' }
      }
    );
  }

  /* Flow nodes */
  var flowNodes = document.querySelectorAll('.flow-node');
  if (flowNodes.length) {
    gsap.fromTo(flowNodes,
      { y: 32, opacity: 0, scale: 0.9 },
      {
        y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.12, ease: 'back.out(1.5)',
        scrollTrigger: { trigger: '.flow-pipeline', start: 'top 80%' }
      }
    );
    var arrows = document.querySelectorAll('.flow-arrow');
    gsap.fromTo(arrows,
      { opacity: 0 },
      {
        opacity: 1, duration: 0.5, stagger: 0.12, delay: 0.3,
        scrollTrigger: { trigger: '.flow-pipeline', start: 'top 80%' }
      }
    );
  }

  /* Macbook cards */
  var macbooks = document.querySelectorAll('.macbook');
  if (macbooks.length) {
    gsap.fromTo(macbooks,
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.cases-grid', start: 'top 80%' }
      }
    );
  }

  /* AI dev section */
  var aidevContent = document.querySelector('.aidev-content');
  if (aidevContent) {
    gsap.fromTo(aidevContent,
      { x: -40, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '#aidev', start: 'top 75%' }
      }
    );
  }

  var aidevVisual = document.querySelector('.aidev-visual');
  if (aidevVisual) {
    gsap.fromTo(aidevVisual,
      { x: 40, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 1, delay: 0.2, ease: 'power3.out',
        scrollTrigger: { trigger: '#aidev', start: 'top 75%' }
      }
    );
  }

  /* AI dev tags */
  var aidevTags = document.querySelectorAll('.aidev-tag');
  if (aidevTags.length) {
    gsap.fromTo(aidevTags,
      { y: 16, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.5, stagger: 0.07,
        scrollTrigger: { trigger: '.aidev-tags', start: 'top 85%' }
      }
    );
  }

  /* Process steps */
  var processSteps = document.querySelectorAll('.process-step');
  processSteps.forEach(function (step, i) {
    gsap.fromTo(step,
      { x: -32, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: step, start: 'top 80%' }
      }
    );
  });

  /* CTA section */
  var ctaContent = document.querySelector('.cta-content');
  if (ctaContent) {
    var ctaKids = ctaContent.children;
    gsap.fromTo(ctaKids,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '#cta', start: 'top 75%' }
      }
    );
  }
}

/* Fallback scroll reveal using IntersectionObserver */
function initScrollFallback() {
  var targets = document.querySelectorAll('.section-eyebrow, .section-title, .section-body, .pain-card, .solution-card, .macbook, .process-step, .flow-node');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(32px)';
    io.observe(el);
  });
}

/* ── 09. Timeline Fill on Scroll ─────────────────────────── */
function initTimeline() {
  var progress = document.getElementById('timelineProgress');
  var timeline = document.getElementById('processTimeline');
  if (!progress || !timeline) return;

  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: timeline,
      start: 'top 70%',
      end: 'bottom 55%',
      scrub: 0.8,
      onUpdate: function (self) {
        progress.style.height = (self.progress * 100) + '%';
      }
    });

    /* Activate step numbers */
    var steps = document.querySelectorAll('.process-step');
    steps.forEach(function (step) {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 65%',
        onEnter: function () { step.classList.add('active'); }
      });
    });
  } else {
    /* Fallback: activate all steps */
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.process-step').forEach(function (step) { io.observe(step); });
  }
}

/* ── 10. Magnetic Buttons ────────────────────────────────── */
function initMagneticButtons() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (typeof gsap === 'undefined') return;

  document.querySelectorAll('.magnetic').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var dx = (e.clientX - cx) * 0.38;
      var dy = (e.clientY - cy) * 0.38;
      gsap.to(btn, { x: dx, y: dy, duration: 0.35, ease: 'power2.out' });
    });

    btn.addEventListener('mouseleave', function () {
      gsap.killTweensOf(btn);
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* ── 11. Hero Mouse Parallax ─────────────────────────────── */
function initParallax() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (typeof gsap === 'undefined') return;

  var hero = document.getElementById('hero');
  if (!hero) return;

  var layers = [
    { el: document.querySelector('.hero-orb-1'), factor: 0.018 },
    { el: document.querySelector('.hero-orb-2'), factor: -0.012 },
    { el: document.getElementById('heroVisual'), factor: -0.012 },
    { el: document.querySelector('.hero-eyebrow'), factor: 0.007 }
  ].filter(function (l) { return l.el; });

  hero.addEventListener('mousemove', function (e) {
    var rect = hero.getBoundingClientRect();
    var cx = rect.width / 2;
    var cy = rect.height / 2;
    var dx = e.clientX - rect.left - cx;
    var dy = e.clientY - rect.top - cy;

    layers.forEach(function (layer) {
      gsap.to(layer.el, {
        x: dx * layer.factor,
        y: dy * layer.factor,
        duration: 1,
        ease: 'power2.out'
      });
    });
  });

  hero.addEventListener('mouseleave', function () {
    layers.forEach(function (layer) {
      gsap.to(layer.el, { x: 0, y: 0, duration: 1.2, ease: 'power2.out' });
    });
  });
}

/* ── 12. CTA Particles Canvas ────────────────────────────── */
function initCtaParticles() {
  var canvas = document.getElementById('cta-canvas');
  var section = document.getElementById('cta');
  if (!canvas || !section) return;

  var ctx = canvas.getContext('2d');
  var particles = [];
  var animating = false;
  var raf;

  function resize() {
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  function createParticles() {
    particles = [];
    var count = Math.min(50, Math.floor(canvas.width / 20));
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.5 + 0.15),
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.4 + 0.08,
        color: Math.random() > 0.55 ? '#BB00FF' : '#EB1E88'
      });
    }
  }

  createParticles();

  function tick() {
    if (document.hidden) { raf = requestAnimationFrame(tick); return; }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(function (p) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
      }
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      var hex = Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
      ctx.fillStyle = p.color + hex;
      ctx.fill();
    });
    raf = requestAnimationFrame(tick);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !animating) {
        animating = true;
        tick();
      } else if (!entry.isIntersecting && animating) {
        animating = false;
        cancelAnimationFrame(raf);
      }
    });
  }, { threshold: 0.1 });

  io.observe(section);
}

/* ── 13. Card Hover Tilt ─────────────────────────────────── */
function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.solution-card, .macbook').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var rx = ((e.clientY - cy) / (rect.height / 2)) * -4;
      var ry = ((e.clientX - cx) / (rect.width / 2)) * 4;
      card.style.transform = 'translateY(-8px) perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });
}

/* ── 14. Smooth Anchor Scroll ────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var navHeight = 80;
      var top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
}

/* ── 15. Init ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  initLoader();
  initCursor();
  initNavbar();
  initMobileMenu();
  initMagneticButtons();
  initParallax();
  initCardTilt();
  initSmoothScroll();

  /* Scroll animations are safe to register immediately —
     they trigger on scroll, not on load, so loader covering
     the screen doesn't cause calculation errors */
  initScrollAnimations();
  initTimeline();
  initCtaParticles();
});
