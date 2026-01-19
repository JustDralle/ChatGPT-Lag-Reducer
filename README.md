# ChatGPT Perf Hider

Did you ever experience heavy lag when your conversation with ChatGPT gets a little too long?  
Typing becomes slow, scrolling stutters, and everything feels like your browser is fighting for its life.

This extension fixes that by **hiding older messages from the page layout**, so the browser no longer recalculates the entire conversation every time a new message appears.

Result: smooth typing, smooth scrolling, no more random freezes when coding or writing long prompts.

---

## ✨ Features

- Automatically hides older messages to reduce DOM size  
- Keeps only the last **N messages** visible (configurable)  
- Reveal older messages in batches or all at once  
- Re-applies hiding when new messages are added  
- Works directly on **chatgpt.com**

This is not about saving RAM.  
It is about reducing **layout and rendering work**, which is what actually causes the lag.

---

## 🤔 Why this exists

Modern chat interfaces should virtualise long message lists.  
ChatGPT currently keeps the entire conversation in the DOM, which causes performance issues during long sessions, especially when writing code or large texts.

This extension is a simple client-side workaround until that is handled properly by the site itself.

---

## 🛠 Installation (Developer mode)

1. Download or clone this repository  
2. Open Chrome or Edge and go to:  
   - `chrome://extensions`  
   - `edge://extensions`  
3. Enable **Developer mode** (top right)  
4. Click **Load unpacked**  
5. Select the extension folder

Open **https://chatgpt.com** and reload the page.  
You should see a small control panel in the bottom-right corner.

---

## 🎛 Controls

From the floating toolbar:

- **Show +X**: reveal older messages in batches  
- **Show all**: reveal the entire conversation  
- **Re-hide**: hide older messages again  
- **Auto-hide ON/OFF**: toggle automatic behaviour

From the popup menu:

- **Keep last**: how many recent messages stay visible  
- **Batch size**: how many messages are revealed per click

For maximum performance, keep the visible message count low.

---

## ⚠ Limitations

- Hidden messages are not searchable with `Ctrl + F`  
- If ChatGPT changes its internal HTML structure, selectors may need updates  
- This does not modify or store any conversation data, it only changes what is rendered on the page

---

## 🏪 Why not on the Chrome Web Store?

Publishing on the Chrome Web Store requires a paid developer account and ongoing maintenance for reviews and policy changes.

This extension is intentionally kept simple and lightweight, and it mainly targets power users who are comfortable installing extensions in developer mode.

For now, GitHub allows:
- Faster updates
- No store approval delays
- No unnecessary fees for a small utility tool

If there is enough interest, a store release may be considered later.

---

## 📜 License

This project is licensed under the **MIT License**.  
You are free to use, modify, and distribute this software.

See the `LICENSE` file for details.

---

## 👤 Author

**Dralle**
Available on discord : justdralle
Built because browsers should not suffer for our long conversations.
