/* =============================================
   AvnerHashomer — Main JS (v2 — Polished)
   ============================================= */

// --- Navbar scroll effect ---
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  });
}

// --- Mobile menu toggle ---
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
  });
}

// --- FAQ Accordion ---
function toggleFaq(button) {
  const item = button.parentElement;
  const isActive = item.classList.contains('active');
  document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
  if (!isActive) item.classList.add('active');
}

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
      if (navLinks) navLinks.classList.remove('active');
      if (menuToggle) menuToggle.textContent = '☰';
    }
  });
});

// --- Scroll Reveal ---
function initScrollReveal() {
  // Add .reveal to all animatable sections
  const selectors = [
    '.section-header',
    '.feature-card',
    '.pain-card',
    '.step',
    '.pipeline-step',
    '.pricing-card',
    '.testimonial-card',
    '.faq-item',
    '.hero-visual',
    '.comparison-table-wrapper',
    '.cta-banner',
    '.trust-badges'
  ];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      if (!el.classList.contains('reveal') && !el.classList.contains('reveal-scale')) {
        el.classList.add('reveal');
        // Stagger children within grids
        const delay = Math.min(i % 4, 5);
        if (delay > 0) el.classList.add(`reveal-delay-${delay}`);
      }
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal, .reveal-scale').forEach(el => {
    observer.observe(el);
  });
}

// --- Animated Counter ---
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number, .pain-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        const text = entry.target.textContent;

        // Extract number from text
        const match = text.match(/[\d.]+/);
        if (!match) return;

        const target = parseFloat(match[0]);
        const isDecimal = text.includes('.');
        const prefix = text.substring(0, text.indexOf(match[0]));
        const suffix = text.substring(text.indexOf(match[0]) + match[0].length);

        const duration = 1500;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out expo
          const eased = 1 - Math.pow(1 - progress, 4);
          const current = target * eased;

          if (isDecimal) {
            entry.target.textContent = prefix + current.toFixed(1) + suffix;
          } else {
            entry.target.textContent = prefix + Math.floor(current) + suffix;
          }

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            entry.target.textContent = text; // Restore original
          }
        }

        requestAnimationFrame(update);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

// --- Parallax effect on hero shapes ---
function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      const rate = scrolled * 0.3;
      hero.style.setProperty('--parallax-y', `${rate}px`);
    }
  });
}

// --- Button ripple effect ---
function initRipple() {
  document.querySelectorAll('.btn-primary, .btn-white').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-anim 0.6s ease-out;
        pointer-events: none;
      `;

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple keyframe
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes ripple-anim {
        to { transform: scale(2.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

// --- Tilt effect on feature cards ---
function initTilt() {
  document.querySelectorAll('.feature-card, .pricing-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) perspective(800px) rotateX(${y * -4}deg) rotateY(${x * 4}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// --- Hero Lead Form Submission ---
function initLeadForm() {
  const form = document.getElementById('heroLeadForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.parentName.value.trim();
    const phone = form.phone.value.trim();

    if (!name || !phone) return;

    // Normalize phone: strip leading 0, add 972 prefix if needed
    let normalized = phone.replace(/[\s\-()]/g, '');
    if (normalized.startsWith('0')) normalized = '972' + normalized.slice(1);
    if (!normalized.startsWith('972')) normalized = '972' + normalized;

    const submitBtn = form.querySelector('.btn-lead-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'שולח...';
    submitBtn.disabled = true;

    try {
      // Try to send lead to backend
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone: normalized })
      });
      if (!res.ok) throw new Error('Server error');
    } catch (_) {
      // Fallback: redirect to WhatsApp with prefilled message
    }

    // Always redirect to WhatsApp as final step
    const waText = encodeURIComponent(`היי, אני ${name} ואני רוצה לנסות את יואב השומר. המספר שלי: ${phone}`);
    window.open(`https://wa.me/972559994876?text=${waText}`, '_blank');

    submitBtn.textContent = 'נשלח בהצלחה!';
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      form.reset();
    }, 3000);
  });
}

// --- Init everything ---
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  animateCounters();
  initParallax();
  initRipple();
  initTilt();
  initLeadForm();
});
