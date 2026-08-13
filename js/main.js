// ============================================
// GIVINTECH — Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSmoothScroll();
  initAnimations();
  initLangToggle();
});

// --- Language Toggle ---
function initLangToggle() {
  const toggle = document.getElementById('lang-toggle');
  const dropdown = document.getElementById('lang-switcher');
  if (!toggle || !dropdown) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  document.addEventListener('click', () => {
    dropdown.classList.remove('open');
  });

  dropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// --- Navbar Scroll Effect ---
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.navbar-toggle');
  const menu = document.querySelector('.navbar-menu');

  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile toggle
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      menu.classList.toggle('active');
      document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

// --- Smooth Scroll ---
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// --- Scroll Animations ---
function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.feature-card, .solution-card, .product-card, .why-card, .stat-card, .combo-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Add CSS for animation
  const style = document.createElement('style');
  style.textContent = `.animate-in { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(style);
}

// --- Product Tabs ---
function initProductTabs() {
  const tabs = document.querySelectorAll('.products-tab');
  const panels = document.querySelectorAll('.products-panel');

  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      panels.forEach(panel => {
        panel.style.display = panel.dataset.panel === target ? 'grid' : 'none';
      });
    });
  });
}

// --- Contact Form ---
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Build WhatsApp message
    const message = `Hi GIVINTECH, I'm ${data.name} from ${data.company || 'N/A'}.\n\nEmail: ${data.email}\nCountry: ${data.country || 'N/A'}\n\n${data.message || 'I\'d like to learn more about your self-service solutions.'}`;

    const whatsappUrl = `https://wa.me/8615553874668?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Show success feedback
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Redirecting to WhatsApp...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initProductTabs();
  initContactForm();
});


