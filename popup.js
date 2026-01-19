const DEFAULTS = { enabled: true, keepLast: 40, batch: 50 };

async function getSettings() {
  const res = await chrome.storage.sync.get('cgptperf');
  return { ...DEFAULTS, ...(res.cgptperf || {}) };
}

async function setSettings(next) {
  await chrome.storage.sync.set({ cgptperf: next });
}

async function sendToActiveTab(payload) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;
  await chrome.tabs.sendMessage(tab.id, { type: 'cgptperf:update', payload });
}

(async () => {
  const s = await getSettings();

  const enabled = document.getElementById('enabled');
  const keepLast = document.getElementById('keepLast');
  const batch = document.getElementById('batch');
  const save = document.getElementById('save');

  enabled.checked = !!s.enabled;
  keepLast.value = s.keepLast;
  batch.value = s.batch;

  save.addEventListener('click', async () => {
    const next = {
      enabled: enabled.checked,
      keepLast: Math.max(1, Number(keepLast.value) || DEFAULTS.keepLast),
      batch: Math.max(10, Number(batch.value) || DEFAULTS.batch)
    };

    await setSettings(next);
    await sendToActiveTab(next);
    window.close();
  });
})();
