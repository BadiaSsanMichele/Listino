/* ============================================
   BADIA SAN MICHELE – main.js
   Scroll animations & interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initSectionDelays();
  initRippleEffect();
  initNightCardHover();
  initContactFeedback();
});

/* ---------- SCROLL ANIMATIONS ---------- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ---------- STAGGERED SECTION DELAYS ---------- */
function initSectionDelays() {
  document.querySelectorAll('.section[data-animate]').forEach((section, i) => {
    section.style.transitionDelay = `${i * 0.08}s`;
  });
}

/* ---------- RIPPLE ON ITEM ROWS ---------- */
function initRippleEffect() {
  // Inject keyframes once
  if (!document.getElementById('ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
      @keyframes rippleAnim {
        from { transform: scale(0); opacity: 1; }
        to   { transform: scale(2.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('pointerdown', e => {
      const ripple = document.createElement('span');
      const rect = item.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top  - size / 2;

      Object.assign(ripple.style, {
        position:     'absolute',
        width:        size + 'px',
        height:       size + 'px',
        top:          y + 'px',
        left:         x + 'px',
        background:   'rgba(181,97,58,0.07)',
        borderRadius: '50%',
        transform:    'scale(0)',
        animation:    'rippleAnim 0.5s ease-out forwards',
        pointerEvents:'none',
      });

      item.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}

/* ---------- NIGHT CARD TILT (desktop) ---------- */
function initNightCardHover() {
  document.querySelectorAll('.night-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const dx = (e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2);
      const dy = (e.clientY - rect.top   - rect.height / 2) / (rect.height / 2);
      card.style.transform  = `translateY(-2px) rotateX(${-dy * 3}deg) rotateY(${dx * 3}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
    });
  });
}

/* ---------- CONTACT PRESS FEEDBACK ---------- */
function initContactFeedback() {
  document.querySelectorAll('.contact-item').forEach(link => {
    link.addEventListener('pointerdown', () => {
      link.style.transform  = 'scale(0.98)';
      link.style.transition = 'transform 0.1s ease';
    });
    ['pointerup', 'pointercancel'].forEach(ev =>
      link.addEventListener(ev, () => { link.style.transform = ''; })
    );
  });
}
