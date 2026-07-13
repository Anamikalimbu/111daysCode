/*
   PORTFOLIO · script.js
   */

'use strict';

/*   1. Custom Cursor  */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Smooth follower
  function animateFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover effects
  document.querySelectorAll('a, button, .project-card, .skill-badge').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      follower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    });
  });
})();


/*  2. Navbar Scroll Behaviour  */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/*  3. Mobile Menu Toggle  */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks   = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('active');
    navLinks.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();


/*  4. Typing Animation  */
(function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const words   = [' Full Stack Developer', ' MERN Developer', ' Student '];
  let wIdx = 0, cIdx = 0, deleting = false, paused = false;

  const TYPING_SPEED   = 90;
  const DELETING_SPEED = 50;
  const PAUSE_AFTER    = 2000;
  const PAUSE_BEFORE   = 400;

  function type() {
    if (paused) return;
    const current = words[wIdx];

    if (!deleting) {
      el.textContent = current.slice(0, ++cIdx);
      if (cIdx === current.length) {
        paused = true;
        setTimeout(() => { deleting = true; paused = false; type(); }, PAUSE_AFTER);
        return;
      }
      setTimeout(type, TYPING_SPEED);
    } else {
      el.textContent = current.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        wIdx = (wIdx + 1) % words.length;
        paused = true;
        setTimeout(() => { paused = false; type(); }, PAUSE_BEFORE);
        return;
      }
      setTimeout(type, DELETING_SPEED);
    }
  }

  // Start after a brief delay
  setTimeout(type, 800);
})();


/*  5. Scroll Reveal (IntersectionObserver)  */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings slightly
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
        const delay = siblings.indexOf(entry.target) * 80;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
})();


/*  6. Smooth Scrolling (for older browsers)  */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 70; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/*  7. Active Nav Highlight on Scroll  */
(function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.id;
      }
    });

    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'var(--primary-light)';
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/*  8. Contact Form Validation & Submission  */
function handleFormSubmit() {
  const nameEl    = document.getElementById('name');
  const emailEl   = document.getElementById('email');
  const messageEl = document.getElementById('message');
  const nameErr   = document.getElementById('nameErr');
  const emailErr  = document.getElementById('emailErr');
  const msgErr    = document.getElementById('msgErr');

  // Clear errors
  [nameErr, emailErr, msgErr].forEach(e => (e.textContent = ''));
  [nameEl, emailEl, messageEl].forEach(e => e.classList.remove('error'));

  const name    = nameEl.value.trim();
  const email   = emailEl.value.trim();
  const message = messageEl.value.trim();

  let valid = true;

  if (name.length < 2) {
    nameErr.textContent = 'Please enter your full name.';
    nameEl.classList.add('error');
    valid = false;
  }

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRx.test(email)) {
    emailErr.textContent = 'Please enter a valid email address.';
    emailEl.classList.add('error');
    valid = false;
  }

  if (message.length < 10) {
    msgErr.textContent = 'Message must be at least 10 characters.';
    messageEl.classList.add('error');
    valid = false;
  }

  if (!valid) return;

  // Save to localStorage
  const entry = { name, email, message, timestamp: new Date().toISOString() };
  const stored = JSON.parse(localStorage.getItem('contactMessages') || '[]');
  stored.push(entry);
  localStorage.setItem('contactMessages', JSON.stringify(stored));

  // Log to console
  console.log('%c📬 Contact Form Submitted', 'color: #818cf8; font-weight: bold; font-size: 14px;');
  console.table(entry);

  // Show success state
  const formContent  = document.getElementById('formContent');
  const successMsg   = document.getElementById('successMsg');
  formContent.style.display = 'none';
  successMsg.classList.add('show');
}
// Expose globally for onclick attribute
window.handleFormSubmit = handleFormSubmit;


/*  9. Skill Badge Stagger Animation  */
(function initSkillBadges() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const badges = entry.target.querySelectorAll('.skill-badge');
        badges.forEach((badge, i) => {
          setTimeout(() => {
            badge.style.animation = `badgePop 0.4s cubic-bezier(0.34,1.56,0.64,1) both`;
          }, i * 80);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  // Inject keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes badgePop {
      from { opacity: 0; transform: scale(0.7) translateY(6px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
  `;
  document.head.appendChild(style);

  document.querySelectorAll('.skill-category').forEach(cat => observer.observe(cat));
})();


/*  10. Hobby Card Animate  */
(function initHobbyCards() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.hobby-card').forEach(card => observer.observe(card));
})();


/*  11. Hero Orb Parallax  */
(function initParallax() {
  const orbs = document.querySelectorAll('.hero-orb');
  if (!orbs.length) return;

  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 12;
      orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  });
})();


/*  12. Page Load Animation  */
(function initPageLoad() {
  document.body.style.opacity = '0';
  window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.6s ease';
    document.body.style.opacity = '1';

    // Trigger hero reveals immediately
    setTimeout(() => {
      document.querySelectorAll('.hero .reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 150);
      });
    }, 200);
  });
})();


/*  13. Year in Footer  */
(function initFooterYear() {
  const yearEl = document.querySelector('.footer-bottom p');
  if (yearEl) {
    yearEl.innerHTML = yearEl.innerHTML.replace('2025', new Date().getFullYear());
  }
})();