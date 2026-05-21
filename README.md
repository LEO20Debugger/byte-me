# byte-me 🚀

**byte-me** is a fun and interactive CLI for developers that delivers **random geeky messages**, coding jokes, and motivational quotes directly in your terminal. 😎  
It also provides **playful error hints** for uncaught exceptions, unhandled rejections, and runtime warnings — perfect for keeping your terminal lively while coding. 💻✨

---

## Features ✨

- 🎯 Receive **random coding messages, jokes, and inspiration**.
- 🛠️ Playful **error hints** for uncaught exceptions, unhandled rejections, and warnings.
- 🌈 Messages are **bold and colorized** in the terminal.
- 🌟 Supports **rainbow mode** for colorful animated messages.
- ⏱️ Schedule messages with a **cron-like syntax**.
- ⚡ Fully compatible with **Node.js projects**, including CLI and backend development.

---

## Installation 📦

Install globally via npm:

```bash
npm install -g @brainergybyleo/byte-me

# Show a fun message instantly
byte-me

# Run in test mode (e.g., every 5 seconds)
byte-me --test

# Enable rainbow animated messages
byte-me --rainbow

# Show one message and exit
byte-me --once

## Configuration ⚙️

Settings are customizable via a JSON file (.byteme.json) in your project directory.

You can adjust:

theme: "plain", "rainbow", or "pastel"

showBanner: true or false

dailyTip: true or false

Example .byteme.json:

{
  "theme": "rainbow",
  "showBanner": true,
  "dailyTip": false
}


## Behavior Notes:

Theme:

"rainbow" or "pastel" shows colorful animated messages.

"plain" cycles through preset colors randomly (e.g., blue, red, cyan).

ShowBanner: If true, an ASCII-art banner is displayed on start; if false, it is hidden.

DailyTip: If true, shows a random motivational tip once per day.


Contact 📧

Need help or want to share feedback? Reach out

Email: leonard6oba@gmail.com

Twitter: @Brainergybyleo

GitHub: Leo20debugger

Feel free to open an issue or PR on GitHub! 🛠️
```
