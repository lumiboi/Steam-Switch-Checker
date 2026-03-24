async function getPageHtmlViaTab(url, timeoutMs = 30000) {
  const tab = await chrome.tabs.create({ url, active: false });
  const tabId = tab.id;

  if (!tabId) {
    throw new Error('Unable to create background tab');
  }

  return new Promise((resolve, reject) => {
    let finished = false;

    const cleanup = async () => {
      chrome.tabs.onUpdated.removeListener(onUpdated);
      try {
        await chrome.tabs.remove(tabId);
      } catch (_) {
        // Ignore tab close errors.
      }
    };

    const done = async (result, error) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      await cleanup();
      if (error) reject(error);
      else resolve(result);
    };

    const onUpdated = async (updatedTabId, info) => {
      if (updatedTabId !== tabId || info.status !== 'complete') return;

      try {
        const [exec] = await chrome.scripting.executeScript({
          target: { tabId },
          func: () => document.documentElement?.outerHTML || '',
        });

        const html = exec?.result || '';
        if (!html) {
          await done(null, new Error('Empty HTML response'));
          return;
        }

        await done({ ok: true, status: 200, text: html });
      } catch (error) {
        await done(null, new Error(error?.message || 'Script injection failed'));
      }
    };

    const timer = setTimeout(async () => {
      await done(null, new Error('Timed out while loading page'));
    }, timeoutMs);

    chrome.tabs.onUpdated.addListener(onUpdated);
  });
}

function isChallengePage(html) {
  if (!html) return false;
  const s = html.toLowerCase();
  return s.includes('just a moment') || s.includes('performing security verification') || s.includes('cf-challenge');
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== 'FETCH_PAGE' || !message.url) return;

  (async () => {
    try {
      const response = await fetch(message.url, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        cache: 'no-store',
        headers: {
          Accept: 'text/html,application/xhtml+xml',
        },
      });

      const text = await response.text();
      if (response.ok && !isChallengePage(text)) {
        sendResponse({ ok: true, status: response.status, text });
        return;
      }

      // Cloudflare-like blocks are resolved via a real browser load in a hidden tab.
      const page = await getPageHtmlViaTab(message.url);
      sendResponse(page);
    } catch (error) {
      sendResponse({ ok: false, error: error?.message || 'Request failed' });
    }
  })();

  return true;
});
