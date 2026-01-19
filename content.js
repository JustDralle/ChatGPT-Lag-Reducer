(() => {
  const DEFAULTS = {
    enabled: true,
    keepLast: 5,     // Number of message visible on your chat page
    batch: 50         // Size of the "Show +x" button
  };

  let settings = { ...DEFAULTS };
  let observer = null;

  function getTurns() {
    let turns = Array.from(document.querySelectorAll('article[data-testid="conversation-turn"]'));

    // Fallbacks
    if (!turns.length) turns = Array.from(document.querySelectorAll('[data-testid="conversation-turn"]'));
    if (!turns.length) turns = Array.from(document.querySelectorAll('article'));

    turns = turns.filter(el => el.offsetParent !== null || el.closest('main'));
    return turns;
  }

  function countHidden() {
    return document.querySelectorAll('.cgptperf-hidden').length;
  }

  function applyHide({ revealAll = false, revealCount = 0 } = {}) {
    const turns = getTurns();
    if (!turns.length) return;

    if (revealAll) {
      turns.forEach(t => t.classList.remove('cgptperf-hidden'));
      updateToolbar();
      return;
    }
 
    if (revealCount > 0) {
      const hidden = turns.filter(t => t.classList.contains('cgptperf-hidden'));
      
      hidden.slice(Math.max(0, hidden.length - revealCount)).forEach(t => t.classList.remove('cgptperf-hidden'));
      updateToolbar();
      return;
    }

    // Basic mode : Hide everything except the Keeplast Value
    const keepLast = Math.max(1, Number(settings.keepLast) || DEFAULTS.keepLast);
    const cutoff = Math.max(0, turns.length - keepLast);

    turns.forEach((t, idx) => {
      if (idx < cutoff) t.classList.add('cgptperf-hidden');
      else t.classList.remove('cgptperf-hidden');
    });

    updateToolbar();
  }

  function ensureToolbar() {
    if (document.getElementById('cgptperf-toolbar')) return;

    const bar = document.createElement('div');
    bar.id = 'cgptperf-toolbar';
    bar.className = 'cgptperf-toolbar';

    bar.innerHTML = `
      <div class="row">
        <span class="badge">ChatGPT Perf</span>
        <span class="muted">Hidden: <b id="cgptperf-hidden-count">0</b></span>
      </div>
      <div class="row">
        <button id="cgptperf-show-batch">Show +</button>
        <button id="cgptperf-show-all">Show all</button>
        <button id="cgptperf-rehide">Re-hide</button>
      </div>
      <div class="row">
        <span class="muted">Keep last: <b id="cgptperf-keep-last">0</b></span>
        <span class="muted">Batch: <b id="cgptperf-batch">0</b></span>
      </div>
      <div class="row">
        <span class="link" id="cgptperf-toggle"></span>
      </div>
    `;

    document.documentElement.appendChild(bar);

    bar.querySelector('#cgptperf-show-batch').addEventListener('click', () => {
      applyHide({ revealCount: settings.batch });
    });

    bar.querySelector('#cgptperf-show-all').addEventListener('click', () => {
      applyHide({ revealAll: true });
    });

    bar.querySelector('#cgptperf-rehide').addEventListener('click', () => {
      applyHide();
    });

    bar.querySelector('#cgptperf-toggle').addEventListener('click', async () => {
      settings.enabled = !settings.enabled;
      await chrome.storage.sync.set({ cgptperf: settings });
      if (settings.enabled) {
        start();
      } else {
        stop();
      }
      updateToolbar();
    });

    updateToolbar();
  }

  function updateToolbar() {
    const bar = document.getElementById('cgptperf-toolbar');
    if (!bar) return;

    const hiddenCountEl = bar.querySelector('#cgptperf-hidden-count');
    const keepLastEl = bar.querySelector('#cgptperf-keep-last');
    const batchEl = bar.querySelector('#cgptperf-batch');
    const showBatchBtn = bar.querySelector('#cgptperf-show-batch');
    const toggleEl = bar.querySelector('#cgptperf-toggle');

    hiddenCountEl.textContent = String(countHidden());
    keepLastEl.textContent = String(settings.keepLast);
    batchEl.textContent = String(settings.batch);
    showBatchBtn.textContent = `Show +${settings.batch}`;

    toggleEl.textContent = settings.enabled ? 'Auto-hide: ON (click to disable)' : 'Auto-hide: OFF (click to enable)';
  }

  function attachObserver() {
    if (observer) return;

    observer = new MutationObserver(() => {
      // minimal throttle : Avoid spam
      requestAnimationFrame(() => {
        if (!settings.enabled) return;
        applyHide();
      });
    });

    // Try main if possible then body
    const root = document.querySelector('main') || document.body;
    if (root) {
      observer.observe(root, { childList: true, subtree: true });
    }
  }

  function detachObserver() {
    if (!observer) return;
    observer.disconnect();
    observer = null;
  }

  function start() {
    ensureToolbar();
    attachObserver();
    applyHide();
  }

  function stop() {
    detachObserver();

    const turns = getTurns();
    turns.forEach(t => t.classList.remove('cgptperf-hidden'));
    updateToolbar();
  }

  async function loadSettings() {
    const res = await chrome.storage.sync.get('cgptperf');
    settings = { ...DEFAULTS, ...(res.cgptperf || {}) };
  }

  // Listen event from popup that you can open by clicking on the extension in your navigator
  chrome.runtime.onMessage.addListener((msg) => {
    if (!msg || msg.type !== 'cgptperf:update') return;
    settings = { ...settings, ...msg.payload };
    if (settings.enabled) start();
    else stop();
  });

  // Init
  (async () => {
    await loadSettings();
    setTimeout(() => {
      if (settings.enabled) start();
      else ensureToolbar();
    }, 500);
  })();
})();
