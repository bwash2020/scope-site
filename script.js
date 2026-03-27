/* ══════════════════════════════════════════════
   SCOPE BUSINESS SERVICES — MAIN SCRIPT v3
   Fonts: Barlow Condensed + Montserrat
   ══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── NAV DROPDOWN ─── */
  document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    const toggle = dropdown.querySelector('.nav-dropdown-toggle');

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = dropdown.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
      }
    });
  });

  /* ─── "COMING SOON" TOAST ─── */
  // Intercepts links with data-coming-soon and shows a polished toast
  const showToast = (() => {
    let toastEl = null;
    let hideTimer = null;

    return (label) => {
      if (!toastEl) {
        toastEl = document.createElement('div');
        toastEl.setAttribute('role', 'status');
        toastEl.setAttribute('aria-live', 'polite');
        toastEl.style.cssText = [
          'position:fixed', 'bottom:32px', 'left:50%',
          'transform:translateX(-50%) translateY(12px)',
          'background:rgba(8,0,64,0.97)',
          'color:#fff',
          'padding:14px 28px',
          'border-radius:8px',
          'border:1px solid rgba(245,197,24,0.35)',
          'font-family:Montserrat,sans-serif',
          'font-size:0.85rem',
          'font-weight:600',
          'letter-spacing:0.04em',
          'box-shadow:0 16px 48px rgba(0,0,0,0.45)',
          'backdrop-filter:blur(18px)',
          '-webkit-backdrop-filter:blur(18px)',
          'opacity:0',
          'transition:opacity 0.25s ease, transform 0.25s ease',
          'z-index:9999',
          'pointer-events:none',
          'white-space:nowrap',
        ].join(';');
        document.body.appendChild(toastEl);
      }

      clearTimeout(hideTimer);
      toastEl.textContent = `${label} — Coming Soon`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          toastEl.style.opacity = '1';
          toastEl.style.transform = 'translateX(-50%) translateY(0)';
        });
      });

      hideTimer = setTimeout(() => {
        toastEl.style.opacity = '0';
        toastEl.style.transform = 'translateX(-50%) translateY(12px)';
      }, 2800);
    };
  })();

  document.querySelectorAll('[data-coming-soon]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showToast(link.dataset.comingSoon);
    });
  });

  /* ─── MARQUEE INITIALIZATION ─── */
  // Duplicate content so the seamless loop works:
  // animation moves translateX(-50%), so 50% must equal exactly one full set of chips.
  document.querySelectorAll('.marquee-inner').forEach(el => {
    el.innerHTML += el.innerHTML;
  });

  /* ─── NAVBAR SCROLL BEHAVIOR ─── */
  const navbar = document.getElementById('navbar');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ─── MOBILE MENU TOGGLE ─── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobileNav');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu when a link is clicked
  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });

  /* ─── SMOOTH SCROLL FOR ALL NAV ANCHORS ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return; // skip dropdown toggles
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('navbar')?.offsetHeight || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ─── REVEAL ON SCROLL (INTERSECTION OBSERVER) ─── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        // Stagger cards by their position among sibling .reveal elements
        const revealSiblings = [...entry.target.parentElement.children]
          .filter(el => el.classList.contains('reveal'));
        const idx = revealSiblings.indexOf(entry.target);

        const explicitDelay =
          entry.target.classList.contains('reveal-delay')   ? 150 :
          entry.target.classList.contains('reveal-delay-2') ? 300 :
          null;

        const delay = explicitDelay !== null ? explicitDelay : Math.min(idx * 80, 480);

        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.07, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ─── COUNTER ANIMATION (hero stats) ─── */
  const counters = document.querySelectorAll('.hstat-num[data-target]');

  const animateCounter = (el) => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start    = performance.now();
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent  = Math.round(easeOutCubic(progress) * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };

    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => counterObserver.observe(counter));

  /* ─── IMPACT STAT COUNTERS ─── */
  const impactNums = document.querySelectorAll('.impact-num[data-target]');

  const impactObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el       = entry.target;
          const target   = parseInt(el.dataset.target, 10);
          const suffix   = el.dataset.suffix || '';
          const duration = 1600;
          const start    = performance.now();
          const ease     = t => 1 - Math.pow(1 - t, 3);

          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            el.textContent  = Math.round(ease(progress) * target) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target + suffix;
          };

          requestAnimationFrame(tick);
          impactObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.4 }
  );

  impactNums.forEach(num => impactObserver.observe(num));

  /* ─── STAY CONNECTED FORM SUBMISSION ─── */
  const signupForm    = document.getElementById('mc-signup-form');
  const signupSuccess = document.getElementById('signupSuccess');

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const required = signupForm.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        const empty = !field.value.trim();
        field.classList.toggle('field-error', empty);
        if (empty) valid = false;
      });
      if (!valid) return;

      const btn = signupForm.querySelector('button[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      fetch('https://formspree.io/f/xkopowqk', {
        method: 'POST',
        body: new FormData(signupForm),
        headers: { 'Accept': 'application/json' }
      })
      .then(res => {
        if (res.ok) {
          signupForm.style.display = 'none';
          signupSuccess.style.display = 'block';
        } else {
          throw new Error('failed');
        }
      })
      .catch(() => {
        btn.textContent = 'Join the Community';
        btn.disabled = false;
        alert('Something went wrong. Please email us at info@scopebusinesses.com');
      });
    });

    signupForm.querySelectorAll('input').forEach(f =>
      f.addEventListener('input', () => f.classList.remove('field-error'))
    );
  }

  /* ─── CONTACT FORM SUBMISSION ─── */
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const required = form.querySelectorAll('[required]');
      let valid = true;

      required.forEach(field => {
        const empty = !field.value.trim();
        field.classList.toggle('field-error', empty);
        if (empty) valid = false;
      });

      if (!valid) return;

      const submitBtn    = form.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled    = true;

      fetch('https://formspree.io/f/xkopowqk', {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
      .then(res => {
        if (res.ok) {
          form.style.display = 'none';
          formSuccess.classList.add('visible');
        } else {
          return res.json().then(data => { throw data; });
        }
      })
      .catch(() => {
        submitBtn.textContent = 'Send Message →';
        submitBtn.disabled = false;
        alert('Something went wrong. Please email us directly at info@scopebusinesses.com');
      });
    });

    // Clear error state on user input
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => field.classList.remove('field-error'));
    });
  }

  /* ─── ACTIVE NAV LINK HIGHLIGHTING ─── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a[href^="#"], .mob-link[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active-nav', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(section => sectionObserver.observe(section));

  /* ─── HERO PARALLAX (subtle) ─── */
  const heroGlows = document.querySelectorAll('.hero-glow');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        heroGlows.forEach((glow, i) => {
          const speed = [0.12, -0.08, 0.06][i] ?? 0;
          glow.style.transform = `translateY(${scrolled * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ─── CARD HOVER TILT (subtle 3D effect) ─── */
  // Applies to service cards, why cards, impact stats, and tile grid cards
  const TILT_SELECTORS = [
    '.svc-card',
    '.why-card',
    '.impact-stat',
    '.tile-card',
  ].join(', ');

  document.querySelectorAll(TILT_SELECTORS).forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = (e.clientX - rect.left)  / rect.width  - 0.5;
      const y    = (e.clientY - rect.top)   / rect.height - 0.5;
      // Tile cards get slightly more aggressive tilt
      const factor = card.classList.contains('tile-card') ? 5 : 4;
      card.style.transform = `translateY(-5px) rotateX(${-y * factor}deg) rotateY(${x * factor}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ─── TILE GRID — stagger entrance ─── */
  // Tile cards already use the .reveal system but we add a sequential
  // delay per tile for a cascade effect within the grid.
  const tileCards = document.querySelectorAll('.tile-card');
  tileCards.forEach((card, i) => {
    // Override the generic delay with grid-position stagger
    const col   = i % 3;
    const row   = Math.floor(i / 3);
    const delay = (col * 60) + (row * 120);
    card.style.transitionDelay = `${delay}ms`;
  });

  /* ─── TILE SPOTLIGHT ROTATION ─── */
  // Every ~4.5s, one tile softly "lights up" with a cinematic focus effect.
  // The .tile-lit class triggers the tileLit CSS animation + stronger glow.
  if (tileCards.length > 0) {
    let spotIndex    = 0;
    let spotTimer    = null;
    let clearTimer   = null;
    const SPOT_HOLD  = 2800;   // ms tile stays lit
    const SPOT_GAP   = 4500;   // ms between spotlights
    const IDLE_DELAY = 3200;   // ms before first spotlight fires

    const fireSpot = () => {
      // Remove from current
      tileCards.forEach(c => c.classList.remove('tile-lit'));
      // Apply to next
      const target = tileCards[spotIndex % tileCards.length];
      target.classList.add('tile-lit');
      spotIndex++;

      // Clear after hold duration
      clearTimer = setTimeout(() => {
        target.classList.remove('tile-lit');
      }, SPOT_HOLD);

      // Schedule next
      spotTimer = setTimeout(fireSpot, SPOT_GAP);
    };

    // Start spotlight loop after initial page-settle delay
    setTimeout(fireSpot, IDLE_DELAY);

    // Pause spotlight on any tile hover (feels more responsive)
    tileCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        clearTimeout(spotTimer);
        clearTimeout(clearTimer);
        tileCards.forEach(c => c.classList.remove('tile-lit'));
      });
      card.addEventListener('mouseleave', () => {
        // Resume after a beat
        clearTimeout(spotTimer);
        spotTimer = setTimeout(fireSpot, SPOT_GAP);
      });
    });
  }

});
