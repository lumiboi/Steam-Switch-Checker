<div align="center">
  <img src="icon128.png" width="96" alt="Steam Switch Checker Logo" />
  <h1>Steam Switch Checker</h1>
  <p>
    <strong>Find the lowest Nintendo eShop price for Steam games directly on Steam pages.</strong><br>
    Powered by eShop-Prices.
  </p>
</div>

## Overview

<img width="1027" height="317" alt="image" src="https://github.com/user-attachments/assets/96b57837-37e7-4174-ac2f-42e434dd2adf" />
<img width="403" height="606" alt="image" src="https://github.com/user-attachments/assets/1c111f3c-05fb-44de-8b43-ab242f9e65dc" />


Steam Switch Checker injects a compact card into Steam app pages and shows:

- matched title on eShop-Prices
- cheapest price in selected currency
- country/store with the lowest price

It supports language and currency selection from the popup.

## Why It Opens A Background Tab

eShop-Prices is protected by anti-bot checks (Cloudflare). In many environments, direct extension `fetch()` calls can return challenge pages or `403`.

To ensure stable results, the extension uses this strategy:

1. Try direct `fetch` in the service worker.
2. If blocked/challenged, load the same URL in a hidden background tab and read the final HTML.

This behavior is intentional and required for reliability under CORS/challenge protection.

## Features

- Works on all `store.steampowered.com/app/*` pages
- Lowest eShop price + country output
- Popup settings: language + currency
- Supports dynamic Steam navigation
- No external backend server required

## Installation (Developer Mode)

1. Download this repository or clone it.
2. Go to `chrome://extensions`.
3. Enable Developer Mode.
4. Click Load unpacked.
5. Select the project folder.

## Build ZIP Package

A release ZIP is generated in `release/steam-switch-checker-v1.1.0.zip` and can be used for distribution.

## Permissions

| Permission | Reason |
|---|---|
| `storage` | Save language/currency preferences |
| `tabs` | Refresh active tab and hidden-tab fallback for blocked requests |
| `scripting` | Read HTML from hidden fallback tab |
| `declarativeNetRequestWithHostAccess` | Header adjustments for network compatibility |
| `host_permissions: store.steampowered.com` | Inject card into Steam pages |
| `host_permissions: eshop-prices.com` | Query and parse eShop-Prices data |

## Project Structure

```
steam-switch-checker/
├── manifest.json
├── background.js
├── content.js
├── popup.html
├── popup.js
├── rules.json
├── icon16.png
├── icon32.png
├── icon48.png
├── icon128.png
├── README.md
└── LICENSE
```

## License

MIT - see LICENSE.
