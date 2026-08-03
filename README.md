# byte-me 🚀

[![CI](https://github.com/LEO20Debugger/byte-me/actions/workflows/ci.yml/badge.svg)](https://github.com/LEO20Debugger/byte-me/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@brainergybyleo/byte-me.svg)](https://www.npmjs.com/package/@brainergybyleo/byte-me)
[![npm downloads](https://img.shields.io/npm/dm/@brainergybyleo/byte-me.svg)](https://www.npmjs.com/package/@brainergybyleo/byte-me)
[![license](https://img.shields.io/npm/l/@brainergybyleo/byte-me.svg)](./LICENSE)

**byte-me** is a fun, interactive CLI for developers that delivers **random geeky messages**, coding jokes, and motivational quotes directly in your terminal. 😎
It also provides **playful error hints** for uncaught exceptions, unhandled rejections, and runtime warnings — perfect for keeping your terminal lively while coding. 💻✨

---

## Features ✨

- 🎯 Random coding messages, jokes, and inspiration.
- 🛠️ Playful error hints for uncaught exceptions, unhandled rejections, and warnings.
- 🌈 Bold, colorized output with an optional rainbow animation mode.
- ⏱️ Schedule messages with a cron-like syntax.
- ⚡ Works in any Node.js project, from CLI tools to backend services.

---

## Installation 📦

Install globally via npm:

```bash
npm install -g @brainergybyleo/byte-me
```

---

## Usage 💻

```bash
# Start the scheduler (a message every 30 minutes)
byte-me

# Show one message and exit
byte-me --once        # -o

# Enable rainbow animated messages
byte-me --rainbow     # -r

# Run in test mode (a message every 5 seconds)
byte-me --test        # -t

# Show desktop/system notifications
byte-me --notify      # -n

# Show the banner plus an instant message
byte-me start
```

---

## Hidden Games 🎮

byte-me ships with a few interactive terminal games — run any of them by name:

```bash
byte-me dungeon       # 🏰 Explore an ASCII dungeon adventure
byte-me hack          # 🕹️  Launch a "secret hack" mini-game
byte-me adventure     # 🌲 Play a 10-level ASCII adventure
byte-me rps           # ✊ Play Rock-Paper-Scissors against the terminal
```

> Running locally from the repo (without a global install)? Use
> `node dist/bin/cli.js <command>`, e.g. `node dist/bin/cli.js dungeon`.

---

## Configuration ⚙️

Settings are customizable via a `.byteme.json` file in your project directory:

```json
{
  "theme": "rainbow",
  "showBanner": true,
  "dailyTip": false
}
```

| Option       | Values                        | Description                                                                 |
| ------------ | ----------------------------- | --------------------------------------------------------------------------- |
| `theme`      | `"plain"`, `"rainbow"`, `"pastel"` | `rainbow`/`pastel` show colorful animated messages; `plain` cycles preset colors. |
| `showBanner` | `true` / `false`              | Display an ASCII-art banner on start.                                       |
| `dailyTip`   | `true` / `false`              | Show a random motivational tip once per day.                                |

---

## Support / Contact 📧

Need help or want to share feedback? Open an [issue](https://github.com/LEO20Debugger/byte-me/issues) or PR on GitHub. 🛠️

- **Email:** leonard6oba@gmail.com
- **Twitter:** [@Brainergybyleo](https://twitter.com/Brainergybyleo)
- **GitHub:** [LEO20Debugger](https://github.com/LEO20Debugger)

---

## License

[MIT](./LICENSE) © Leonard Oba
