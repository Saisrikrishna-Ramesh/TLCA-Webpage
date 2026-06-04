/* ═══════════════════ SCRIPT.JS ═══════════════════ */

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Mobile menu toggle ──
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  navToggle.classList.toggle('open');
});
// Close menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    navToggle.classList.remove('open');
  });
});

// ── Scroll-reveal animations ──
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = entry.target.parentElement.querySelectorAll('.animate-on-scroll');
      const index = Array.from(siblings).indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 100);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// ── Counter animation ──
function animateCounters() {
  document.querySelectorAll('.stat-number[data-target]').forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(ease * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// Trigger counters when hero stats are visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ── Smooth scroll for nav links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ── EmailJS config — fill these in after creating your free account at emailjs.com ──
const EMAILJS_PUBLIC_KEY   = 'YOUR_PUBLIC_KEY';   // Account → API Keys → Public Key
const EMAILJS_SERVICE_ID   = 'YOUR_SERVICE_ID';   // Email Services → your service ID
const EMAILJS_TEMPLATE_ID  = 'YOUR_TEMPLATE_ID';  // Email Templates → your template ID

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// ── Contact form → sends email via EmailJS ──
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;

    // Show loading state
    btn.innerHTML = '<i class="ph ph-circle-notch"></i> Sending...';
    btn.disabled = true;

    const templateParams = {
      from_name:  document.getElementById('form-name').value.trim(),
      from_phone: document.getElementById('form-phone').value.trim(),
      from_email: document.getElementById('form-email').value.trim(),
      curriculum: document.getElementById('form-curriculum').value,
      message:    document.getElementById('form-message').value.trim(),
      to_email:   'tlca.enquiries@gmail.com',
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(() => {
        btn.innerHTML = '<i class="ph ph-check-circle"></i> Message Sent!';
        btn.style.background = '#28a06e';
        contactForm.reset();
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        btn.innerHTML = '<i class="ph ph-warning"></i> Failed — try again';
        btn.style.background = '#c0392b';
        btn.disabled = false;
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.background = '';
        }, 4000);
      });
  });
}

// ── Active nav link highlight ──
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
});
