import cron from "node-cron";
import chalk from "chalk";
import { rainbow, pastel } from "gradient-string";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { homedir } from "os";

// --- Resolve package paths safely ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const messagesPath = join(__dirname, "../json/messages.json");

// --- Load messages ---
let messages = {};
try {
  messages = JSON.parse(readFileSync(messagesPath, "utf-8"));
} catch (err) {
  console.warn(
    "⚠️ Failed to load messages.json, using empty messages.",
    err.message
  );
}

// --- Colors ---
const colors = ["yellow", "blue", "magenta", "cyan", "whiteBright"];

// --- Config and state ---
const configPath = join(homedir(), ".byteme.json");
const defaults = { theme: "pastel", showBanner: true, dailyTip: false };

export function loadConfig() {
  if (!existsSync(configPath)) {
    saveConfig(defaults, true);
    return defaults;
  }
  try {
    const userConfig = JSON.parse(readFileSync(configPath, "utf-8"));
    return { ...defaults, ...userConfig };
  } catch {
    console.warn("⚠️ Config corrupted, resetting to defaults.");
    saveConfig(defaults, true);
    return defaults;
  }
}

export function saveConfig(newConfig, silent = false) {
  const finalConfig = { ...defaults, ...newConfig };
  try {
    writeFileSync(configPath, JSON.stringify(finalConfig, null, 2));
    if (!silent) console.log("✅ Config updated!");
  } catch (err) {
    console.error("❌ Failed to save config:", err.message);
  }
}

// --- State for daily tips ---
const statePath = join(homedir(), ".byteme-state.json");
function loadState() {
  if (!existsSync(statePath)) return {};
  return JSON.parse(readFileSync(statePath, "utf-8"));
}
function saveState(state) {
  writeFileSync(statePath, JSON.stringify(state, null, 2));
}

// --- Time category helper ---
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

  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
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

// --- Main scheduler ---
export function scheduleFun({
  cronTime = "0 */30 * * * *",
  rainbow: useRainbow = false,
  once = false,
} = {}) {
  if (typeof cronTime !== "string")
    throw new TypeError("cronTime must be a string");

  console.log(chalk.blue.bold("🚀 byte-me started!\n"));

  // Show daily tip at start
  showDailyTip();

  const showMessage = () => {
    const msg = getRandomMessage();
    const color = colors[Math.floor(Math.random() * colors.length)];
    let output = chalk[color](msg);
    if (useRainbow) output = rainbow(msg);
    console.log(chalk.green.bold("[byte-me]"), output);

    if (once) process.exit(0);
  };

  if (once) showMessage();
  else cron.schedule(cronTime, showMessage);
}

// --- Default export ---
function byteMe(options = {}) {
  scheduleFun(options);

  // Global error handlers
  process.on("uncaughtException", showErrorHint);
  process.on("unhandledRejection", showErrorHint);
  process.on("warning", showErrorHint);
}

// Attach getRandomMessage for CLI or easter egg usage
export default Object.assign(byteMe, { getRandomMessage });
