// ============================================
// GIVINTECH — i18n Engine
// ============================================

const I18N = {
  currentLang: 'en',
  supportedLangs: ['en', 'ja', 'de', 'es', 'fr', 'ko', 'pt', 'ar'],
  translations: {},
  rtlLangs: ['ar'],

  // Language display names (native)
  langNames: {
    en: 'English',
    ja: '日本語',
    de: 'Deutsch',
    es: 'Español',
    fr: 'Français',
    ko: '한국어',
    pt: 'Português',
    ar: 'العربية'
  },

  async init() {
    // Get saved language or detect browser language
    const saved = localStorage.getItem('GIVINTECH_lang');
    if (saved && this.supportedLangs.includes(saved)) {
      this.currentLang = saved;
    } else {
      const browserLang = (navigator.language || 'en').split('-')[0];
      if (this.supportedLangs.includes(browserLang)) {
        this.currentLang = browserLang;
      }
    }

    // Load translations
    await this.loadTranslations(this.currentLang);

    // Apply translations
    this.apply();

    // Update language switcher
    this.updateSwitcher();

    // Set HTML lang & dir
    document.documentElement.lang = this.currentLang;
    document.documentElement.dir = this.rtlLangs.includes(this.currentLang) ? 'rtl' : 'ltr';
  },

  async loadTranslations(lang) {
    if (this.translations[lang]) return;
    try {
      const basePath = document.querySelector('script[src*="i18n.js"]')?.src.replace(/i18n\.js.*$/, '') || '';
      const resp = await fetch(`${basePath}../i18n/${lang}.json`);
      this.translations[lang] = await resp.json();
    } catch (e) {
      console.warn(`Failed to load translations for ${lang}`, e);
      this.translations[lang] = {};
    }
  },

  apply() {
    const t = this.translations[this.currentLang] || {};

    // Translate all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = t[key];
        } else {
          el.innerHTML = t[key];
        }
      }
    });

    // Translate all elements with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key]) el.placeholder = t[key];
    });

    // Translate all elements with data-i18n-aria
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (t[key]) el.setAttribute('aria-label', t[key]);
    });

    // Translate meta tags
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && t['meta_description']) metaDesc.content = t['meta_description'];
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && t['meta_title']) ogTitle.content = t['meta_title'];
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && t['meta_description']) ogDesc.content = t['meta_description'];
  },

  async switchLang(lang) {
    if (!this.supportedLangs.includes(lang)) return;
    this.currentLang = lang;
    localStorage.setItem('GIVINTECH_lang', lang);

    await this.loadTranslations(lang);
    this.apply();
    this.updateSwitcher();

    document.documentElement.lang = lang;
    document.documentElement.dir = this.rtlLangs.includes(lang) ? 'rtl' : 'ltr';

    // RTL adjustments
    if (this.rtlLangs.includes(lang)) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  },

  updateSwitcher() {
    const switcher = document.getElementById('lang-switcher');
    const currentDisplay = document.getElementById('lang-current');
    if (!switcher) return;

    if (currentDisplay) {
      currentDisplay.textContent = this.currentLang.toUpperCase();
    }

    switcher.innerHTML = '';
    this.supportedLangs.forEach(lang => {
      const btn = document.createElement('button');
      btn.className = `lang-btn ${lang === this.currentLang ? 'active' : ''}`;
      btn.textContent = this.langNames[lang];
      btn.setAttribute('data-lang', lang);
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.switchLang(lang);
        // Close dropdown
        switcher.classList.remove('open');
        // Close mobile menu if open
        const menu = document.querySelector('.navbar-menu');
        const toggle = document.querySelector('.navbar-toggle');
        if (menu) menu.classList.remove('active');
        if (toggle) toggle.classList.remove('active');
      });
      switcher.appendChild(btn);
    });
  },

  // Helper: get translation
  t(key) {
    return (this.translations[this.currentLang] || {})[key] || key;
  }
};

// Auto-init when DOM ready
document.addEventListener('DOMContentLoaded', () => I18N.init());


