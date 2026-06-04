/* ============================================
   N.K. International Management Pvt. Ltd.
   Corporate Website — Interactive Features
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ─── Element References ───
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const backToTop = document.getElementById('backToTop');
  const lightbox = document.getElementById('lightbox');
  const lightboxVisual = document.getElementById('lightboxVisual');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const heroParticles = document.getElementById('heroParticles');

  // ─── 1. Hero Particles ───
  function createParticles() {
    if (!heroParticles) return;
    const count = window.innerWidth < 768 ? 15 : 30;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.classList.add('hero__particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.width = (Math.random() * 3 + 1) + 'px';
      particle.style.height = particle.style.width;
      particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';
      particle.style.opacity = Math.random() * 0.4 + 0.1;
      heroParticles.appendChild(particle);
    }
  }
  createParticles();

  // ─── 2. Navbar Scroll Effect ───
  let lastScroll = 0;
  function handleNavbarScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }

  // ─── 3. Active Nav Highlighting ───
  const sections = document.querySelectorAll('section[id]');
  const navLinkElements = document.querySelectorAll('.navbar__link');

  function highlightActiveNav() {
    const scrollY = window.scrollY + 120;
    let currentSection = '';

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinkElements.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  }

  // ─── 4. Back to Top Button ───
  function handleBackToTop() {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── Combined Scroll Handler (throttled) ───
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        handleNavbarScroll();
        highlightActiveNav();
        handleBackToTop();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  // ─── 5. Mobile Menu Toggle ───
  function openMobileMenu() {
    hamburger.classList.add('active');
    navLinks.classList.add('open');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close mobile menu when a link is clicked
  navLinkElements.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  });

  // ─── 6. Smooth Scroll for Nav Links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetEl.offsetTop - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ─── 7. Dark Mode Toggle ───
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nk-theme', theme);
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
  }

  // Check saved theme
  const savedTheme = localStorage.getItem('nk-theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ─── 8. Scroll Animations (Intersection Observer) ───
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const animateObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          animateObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => animateObserver.observe(el));
  } else {
    // Fallback: show everything
    animateElements.forEach(el => el.classList.add('animated'));
  }

  // ─── 9. Counter Animation ───
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = new Set();

  function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const startTime = performance.now();

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentValue = Math.floor(target * easedProgress);

      counter.textContent = currentValue.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(updateCounter);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          if (!countersAnimated.has(counter)) {
            countersAnimated.add(counter);
            animateCounter(counter);
          }
          counterObserver.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  // ─── 10. Accordion ───
  const accordionHeaders = document.querySelectorAll('.accordion__header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.accordion__body');
      const content = item.querySelector('.accordion__content');
      const isActive = item.classList.contains('active');

      // Close all accordion items in same group
      const accordion = item.closest('.accordion');
      if (accordion) {
        accordion.querySelectorAll('.accordion__item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.accordion__body').style.maxHeight = '0';
          }
        });
      }

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
        body.style.maxHeight = '0';
      } else {
        item.classList.add('active');
        body.style.maxHeight = content.scrollHeight + 32 + 'px';
      }
    });
  });

  // ─── 11. Gallery Lightbox ───
  const galleryItems = document.querySelectorAll('.gallery__item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const title = item.getAttribute('data-title') || '';
      const desc = item.getAttribute('data-desc') || '';

      // Clone the visual for the lightbox
      const visual = item.querySelector('.gallery__item-visual');
      if (visual && lightboxVisual) {
        lightboxVisual.innerHTML = '';
        const clone = visual.cloneNode(true);
        clone.classList.add('lightbox__visual-content');
        lightboxVisual.appendChild(clone);
      }

      if (lightboxCaption) {
        lightboxCaption.innerHTML = `<strong>${title}</strong><br>${desc}`;
      }

      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Close lightbox on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeMobileMenu();
    }
  });

  // ─── 13. Smooth Reveal for Hero Elements ───
  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    heroContent.querySelectorAll('.animate-on-scroll').forEach((el, index) => {
      el.style.transitionDelay = (index * 150) + 'ms';
      // Trigger animation after a brief delay
      setTimeout(() => {
        el.classList.add('animated');
      }, 100);
    });
  }

  // ─── 14. Handle Window Resize ───
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    }, 250);
  });

  // ─── Initial Calls ───
  handleNavbarScroll();
  highlightActiveNav();
  handleBackToTop();
});
