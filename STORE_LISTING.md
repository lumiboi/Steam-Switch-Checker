# Chrome Web Store — Listing Assets

## Short Description (132 chars max)
Find the lowest Nintendo eShop price for Steam games instantly, including the cheapest country and selected currency.

## Full Description (max 16,000 chars)

**Steam Switch Checker** adds a sleek card to every Steam game page and shows the lowest Nintendo eShop price for that game, powered by eShop-Prices.

No account needed. No tracking. No ads.

---

### How it works

1. Open any game on store.steampowered.com
2. A card appears automatically above the purchase section
3. The card shows: matched game, lowest price, and cheapest country eShop
4. Use the popup to choose your display language and currency

---

### Features

✔ Instant lowest-price lookup on every Steam app page
✔ Shows cheapest country/store and price in selected currency
✔ Smart title matching for subtitle/edition variations
✔ 29 supported languages: English, Türkçe, Deutsch, Français, Español, 日本語, 한국어, 简体中文, Русский, Italiano, Polski, Português, and more
✔ Clean dark UI that blends with Steam's design
✔ Works with dynamic navigation — no page reload needed
✔ Fully open source (MIT license)

---

### Privacy

This extension does not collect, store, or transmit any personal data. It communicates with eshop-prices.com to retrieve publicly available pricing pages. Language and currency preferences are stored with Chrome sync storage.

Note: due to anti-bot/CORS protections on pricing pages, the extension may use a hidden background tab fallback when direct fetch requests are blocked.

See the full source at: https://github.com/YOUR_USERNAME/steam-switch-checker

---

## Category
Productivity / Shopping

## Language
English (primary), supports 29 languages in-extension

## Permissions Justification

- storage: Save user language/currency preference
- tabs: Refresh in-page card and hidden fallback tab flow when network requests are blocked
- scripting: Read page HTML in hidden fallback tab
- declarativeNetRequestWithHostAccess: Apply request compatibility headers
- host_permissions store.steampowered.com: Inject the checker card into Steam pages
- host_permissions eshop-prices.com: Fetch pricing/search pages from eShop-Prices

## Screenshots needed
1. Steam game page with lowest price and cheapest country card
2. Popup showing language and currency selector
3. Steam game page with search/no-match state
4. Steam game page with alternate result state

## Promotional tile text (140x140 small tile)
Steam Switch Checker

## Marquee promo (1400x560) headline
Find the lowest eShop price
On every Steam game page.
