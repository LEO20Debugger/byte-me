import cron from "node-cron";
import chalk from "chalk";
import { rainbow } from "gradient-string";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load messages
const messages = JSON.parse(
  readFileSync(join(__dirname, "messages.json"), "utf-8")
);

// Available chalk colors for fun randomness
const colors = ["yellow", "blue", "magenta", "cyan", "whiteBright"];

// --- helper for time category ---
function getTimeCategory() {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday

  if (day === 0 || day === 6) return "weekend";
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 18 || hour < 5) return "night";

  return "general";
}

// --- helper to pick message ---
function getRandomMessage({ error = false } = {}) {
  const category = getTimeCategory();
  let pool = messages[category] || messages.general;

  // Occasionally throw in extras
  if (!error && Math.random() < 0.2) pool = messages.inspiration;
  if (!error && Math.random() < 0.2) pool = messages.jokes;

  // Use error messages if error flag is true
  if (error && messages.errors) pool = messages.errors;

  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

// --- function to show error hints ---
export function showErrorHint(err) {
  const msg = getRandomMessage({ error: true });

  // Random color for error message
  const color = colors[Math.floor(Math.random() * colors.length)];

  console.error(chalk.red.bold("[ERROR]"), err.message || err);
  console.log(chalk.bold[color]("[byte-me]"), chalk.bold(msg));
}

// --- scheduler ---
export function scheduleFun({
  cronTime = "0 */30 * * * *",
  rainbow: useRainbow = false,
  once = false,
}) {
  console.log(chalk.blue.bold("🚀 byte-me started!\n"));

  const showMessage = () => {
    const msg = getRandomMessage();

    // Random color for normal message
    const color = colors[Math.floor(Math.random() * colors.length)];
    let output = chalk[color](msg);

    if (useRainbow) output = rainbow(msg);

    console.log(chalk.green.bold("[byte-me]"), output);

    if (once) process.exit(0);
  };

  if (once) {
    showMessage();
  } else {
    cron.schedule(cronTime, showMessage);
  }
}

// --- Global error handling with random chance ---
const ERROR_CHANCE = 0.4; // 40% chance to show fun message

process.on("uncaughtException", (err) => {
  if (Math.random() < ERROR_CHANCE) showErrorHint(err);
});

process.on("unhandledRejection", (reason) => {
  if (Math.random() < ERROR_CHANCE) showErrorHint(reason);
});

process.on("warning", (warning) => {
  if (Math.random() < ERROR_CHANCE) showErrorHint(warning);
});

// --- Example usage ---
// scheduleFun({ cronTime: "*/10 * * * * *", rainbow: true });
// throw new Error("Test uncaught exception!");
// Promise.reject("Test unhandled rejection!");
