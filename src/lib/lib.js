import cron from "node-cron";
import chalk from "chalk";
import { rainbow, pastel } from "gradient-string";
import figlet from "figlet";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { cwd } from "process";
import messages from "../json/messages.json";

// --- Paths for user configs/state ---
const configPath = join(cwd(), ".byteme.json");
const statePath = join(cwd(), ".byteme-state.json");

// --- Default config ---
const defaults = {
  theme: "pastel", // rainbow, pastel, or plain
  showBanner: true,
  dailyTip: false,
};

// --- Colors for plain mode ---
const colors = ["yellow", "blue", "magenta", "cyan", "whiteBright"];

// --- Config functions ---
export function saveConfig(newConfig = {}, silent = false) {
  const finalConfig = { ...defaults, ...newConfig };
  try {
    writeFileSync(configPath, JSON.stringify(finalConfig, null, 2));
    if (!silent) console.log("✅ Config updated!");
  } catch (err) {
    console.error("❌ Failed to save config:", err.message);
  }
}

export function loadConfig() {
  if (!existsSync(configPath)) {
    saveConfig({}, true);
    return defaults;
  }
  try {
    const userConfig = JSON.parse(readFileSync(configPath, "utf-8"));
    return { ...defaults, ...userConfig };
  } catch (err) {
    console.warn("⚠️ Config is corrupted. Resetting to defaults.", err.message);
    saveConfig({}, true);
    return defaults;
  }
}

// --- State for daily tips ---
function loadState() {
  if (!existsSync(statePath)) return {};
  return JSON.parse(readFileSync(statePath, "utf-8"));
}

function saveState(state) {
  writeFileSync(statePath, JSON.stringify(state, null, 2));
}

// --- Time category ---
function getTimeCategory() {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  if (day === 0 || day === 6) return "weekend";
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 18 || hour < 5) return "night";
  return "general";
}

// --- Random message ---
export function getRandomMessage({ error = false } = {}) {
  let pool = messages[getTimeCategory()] || messages.general || [];
  if (!error && Math.random() < 0.2) pool = messages.inspiration || pool;
  if (!error && Math.random() < 0.2) pool = messages.jokes || pool;
  if (error && messages.errors) pool = messages.errors;
  if (!pool.length) return "Hello! Your message pool is empty.";
  return pool[Math.floor(Math.random() * pool.length)];
}

// --- Error handling ---
export function showErrorHint(err) {
  const msg = getRandomMessage({ error: true });
  const color = colors[Math.floor(Math.random() * colors.length)];
  console.error(chalk.red.bold("[ERROR]"), err?.message || err);
  console.log(chalk.bold[color]("[byte-me]"), chalk.bold(msg));
}

// --- Daily tips ---
export function showDailyTip() {
  const config = loadConfig();
  if (!config.dailyTip) return;

  const today = new Date().toISOString().split("T")[0];
  const state = loadState();
  if (state.lastTipDate === today) return;

  const tips = messages.tips || [];
  if (!tips.length) return;

  const tip = tips[Math.floor(Math.random() * tips.length)];
  console.log(chalk.cyan.bold("\n💡 Daily Tip: "), chalk.white(tip), "\n");

  saveState({ lastTipDate: today });
}

// --- Banner generator ---
function getBannerText(text = "BYTE-ME!") {
  return figlet.textSync(text, {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default",
  });
}

// --- Main scheduler ---
export function scheduleFun({
  cronTime = "0 */30 * * * *",
  rainbow: forceRainbow = false,
  once = false,
} = {}) {
  if (typeof cronTime !== "string")
    throw new TypeError("cronTime must be a string");

  const config = loadConfig();

  // --- Show Banner ---
  if (config.showBanner) {
    const bannerText = getBannerText("BYTE-ME!");
    if (config.theme === "rainbow") console.log(rainbow(bannerText));
    else if (config.theme === "pastel") console.log(pastel(bannerText));
    else {
      const color = colors[Math.floor(Math.random() * colors.length)];
      console.log(chalk[color].bold(bannerText));
    }
  }

  showDailyTip();

  const showMessage = () => {
    const msg = getRandomMessage();
    let output;

    if (forceRainbow || config.theme === "rainbow") output = rainbow(msg);
    else if (config.theme === "pastel") output = pastel(msg);
    else {
      const color = colors[Math.floor(Math.random() * colors.length)];
      output = chalk[color](msg);
    }

    console.log(chalk.green.bold("[byte-me]"), output);

    if (once) process.exit(0);
  };

  if (once) showMessage();
  else cron.schedule(cronTime, showMessage);
}

// --- Default export ---
function byteMe(options = {}) {
  loadConfig();
  scheduleFun(options);

  process.on("uncaughtException", showErrorHint);
  process.on("unhandledRejection", showErrorHint);
  process.on("warning", showErrorHint);
}

export default Object.assign(byteMe, {
  getRandomMessage,
  loadConfig,
  saveConfig,
  showDailyTip,
  scheduleFun,
});
