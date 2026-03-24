'use strict';

// ─── All supported languages (Steam's major locales) ───────────────────────
const LANGUAGES = [
  { code: 'en',    label: 'English' },
  { code: 'tr',    label: 'Türkçe' },
  { code: 'de',    label: 'Deutsch' },
  { code: 'fr',    label: 'Français' },
  { code: 'es',    label: 'Español' },
  { code: 'es-419',label: 'Español (Latinoamérica)' },
  { code: 'pt',    label: 'Português' },
  { code: 'pt-BR', label: 'Português (Brasil)' },
  { code: 'ru',    label: 'Русский' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'ja',    label: '日本語' },
  { code: 'ko',    label: '한국어' },
  { code: 'ar',    label: 'العربية' },
  { code: 'pl',    label: 'Polski' },
  { code: 'nl',    label: 'Nederlands' },
  { code: 'cs',    label: 'Čeština' },
  { code: 'hu',    label: 'Magyar' },
  { code: 'ro',    label: 'Română' },
  { code: 'sv',    label: 'Svenska' },
  { code: 'no',    label: 'Norsk' },
  { code: 'da',    label: 'Dansk' },
  { code: 'fi',    label: 'Suomi' },
  { code: 'it',    label: 'Italiano' },
  { code: 'el',    label: 'Ελληνικά' },
  { code: 'uk',    label: 'Українська' },
  { code: 'th',    label: 'ภาษาไทย' },
  { code: 'vi',    label: 'Tiếng Việt' },
  { code: 'id',    label: 'Bahasa Indonesia' },
];

const CURRENCIES = [
  { code: 'TRY', label: 'TRY - Turkish Lira' },
  { code: 'USD', label: 'USD - US Dollar' },
  { code: 'EUR', label: 'EUR - Euro' },
  { code: 'GBP', label: 'GBP - British Pound' },
  { code: 'JPY', label: 'JPY - Japanese Yen' },
  { code: 'CAD', label: 'CAD - Canadian Dollar' },
  { code: 'AUD', label: 'AUD - Australian Dollar' },
  { code: 'BRL', label: 'BRL - Brazilian Real' },
  { code: 'MXN', label: 'MXN - Mexican Peso' },
  { code: 'PLN', label: 'PLN - Polish Zloty' },
  { code: 'SEK', label: 'SEK - Swedish Krona' },
  { code: 'NOK', label: 'NOK - Norwegian Krone' },
  { code: 'CHF', label: 'CHF - Swiss Franc' },
  { code: 'CZK', label: 'CZK - Czech Koruna' },
  { code: 'HUF', label: 'HUF - Hungarian Forint' },
];

// ─── UI string translations ─────────────────────────────────────────────────
const UI = {
  en: {
    sectionLabel: 'Display Language',
    currencyLabel: 'Currency',
    saveLabel: 'Save Settings',
    saved: 'Settings saved successfully.',
    sourceLabel: 'Data Source',
    coverageLabel: 'Coverage',
    modeLabel: 'Works on',
    sourceVal: 'eShop-Prices',
    matchLabel: 'Shown Data',
    matchVal: 'Lowest price + country',
    activeLabel: 'Active on Steam pages',
  },
  tr: {
    sectionLabel: 'Görüntü Dili',
    currencyLabel: 'Para Birimi',
    saveLabel: 'Ayarları Kaydet',
    saved: 'Ayarlar başarıyla kaydedildi.',
    sourceLabel: 'Veri Kaynağı',
    coverageLabel: 'Kapsam',
    modeLabel: 'Çalıştığı Site',
    sourceVal: 'eShop-Prices',
    matchLabel: 'Gösterilen Veri',
    matchVal: 'En ucuz fiyat + ülke',
    activeLabel: 'Steam sayfalarında aktif',
  },
};

// Fallback to English for languages without a full UI translation
function getUI(lang) {
  const base = lang.split('-')[0];
  return { ...UI.en, ...(UI[base] || {}), ...(UI[lang] || {}) };
}

// ─── Storage helpers ────────────────────────────────────────────────────────
async function getSettings() {
  const data = await chrome.storage.sync.get({ language: 'en', currency: 'TRY' });
  return {
    language: data.language || 'en',
    currency: data.currency || 'TRY',
  };
}

// ─── DOM helpers ────────────────────────────────────────────────────────────
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function applyUI(lang) {
  const ui = getUI(lang);
  document.documentElement.lang = lang;
  setText('lbl-language', ui.sectionLabel);
  setText('lbl-currency', ui.currencyLabel);
  setText('save-label', ui.saveLabel);
  setText('lbl-source', ui.sourceLabel);
  setText('lbl-source-val', ui.sourceVal);
  setText('lbl-coverage', ui.coverageLabel);
  setText('lbl-mode', ui.modeLabel);
  setText('lbl-match', ui.matchLabel);
  setText('lbl-match-val', ui.matchVal);
  setText('lbl-active', ui.activeLabel);
}

function showStatus(message, type = 'success') {
  const bar = document.getElementById('status-bar');
  const text = document.getElementById('status-text');
  const icon = document.getElementById('status-icon');

  bar.className = `status-bar ${type}`;
  text.textContent = message;

  if (type === 'success') {
    icon.innerHTML = `<path d="M2 7.5l3.5 3.5 6.5-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
  } else {
    icon.innerHTML = `<path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  setTimeout(() => { bar.className = 'status-bar hidden'; }, 2500);
}

async function notifyActiveTab(language, currency) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;
  try {
    await chrome.tabs.sendMessage(tab.id, {
      type: 'SET_SETTINGS',
      language,
      currency,
    });
  } catch (_) { /* no content script on this page */ }
}

// ─── Bootstrap ──────────────────────────────────────────────────────────────
(async () => {
  const languageSelect = document.getElementById('language');
  const currencySelect = document.getElementById('currency');

  // Populate language options
  for (const { code, label } of LANGUAGES) {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = label;
    languageSelect.appendChild(opt);
  }

  // Populate currency options
  for (const { code, label } of CURRENCIES) {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = label;
    currencySelect.appendChild(opt);
  }

  // Load saved settings
  const settings = await getSettings();
  languageSelect.value = settings.language;
  currencySelect.value = settings.currency;
  applyUI(settings.language);

  // Live preview on select change
  languageSelect.addEventListener('change', () => applyUI(languageSelect.value));

  // Save button
  document.getElementById('save').addEventListener('click', async () => {
    const language = languageSelect.value;
    const currency = currencySelect.value;

    await chrome.storage.sync.set({ language, currency });
    applyUI(language);
    await notifyActiveTab(language, currency);
    showStatus(getUI(language).saved, 'success');
  });
})();
