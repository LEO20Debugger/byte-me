#!/usr/bin/env node
import { Command } from "commander";
import { pastel, rainbow as rainbowGradient } from "gradient-string";
import byteMe from "@brainergybyleo/byte-me";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { runFakeHackGame } from "./easterEgg.js";
import { runDungeon } from "./dungeon.js";
import { asciiAdventure10, rpsGame } from "./game.js";

// --- Config path ---
const configPath = join(homedir(), ".byteme.json");

// --- Default config ---
const defaults = {
  theme: "pastel",
  showBanner: true,
  dailyTip: false,
};

// --- Load or initialize config ---
function loadConfig() {
  if (!existsSync(configPath)) {
    saveConfig(defaults, true);
    return defaults;
  }
  try {
    const userConfig = JSON.parse(readFileSync(configPath, "utf8"));
    return { ...defaults, ...userConfig };
  } catch {
    console.warn("⚠️ Config file is corrupted, resetting to defaults.");
    saveConfig(defaults, true);
    return defaults;
  }
}

// --- Save config ---
function saveConfig(newConfig, silent = false) {
  const finalConfig = { ...defaults, ...newConfig };
  try {
    writeFileSync(configPath, JSON.stringify(finalConfig, null, 2));
    if (!silent) console.log("✅ Config updated!");
  } catch (err) {
    console.error("❌ Failed to save config:", err.message);
  }
}

// --- Gradient helper ---
function getGradient(themeName) {
  switch ((themeName || "").toLowerCase()) {
    case "pastel":
      return pastel;
    case "rainbow":
      return rainbowGradient;
    default:
      return pastel;
  }
}

// --- CLI program ---
const program = new Command();

program
  .name("byte-me")
  .description("A fun CLI that surprises you with random geeky messages 🚀")
  .option("-t, --test", "Run every 5 seconds (for testing)")
  .option("-r, --rainbow", "Enable rainbow animated messages 🌈")
  .option("-n, --notify", "Show system notifications 🔔")
  .option("-o, --once", "Show one message and exit");

// --- Easter egg command for banner + message ---
program
  .command("start")
  .description("Show fun message instantly 🎉")
  .action(() => {
    if (defaults.showBanner) {
      import("figlet").then(({ default: figlet }) => {
        figlet("BYTE-ME!", (err, data) => {
          if (!err && data) {
            const theme = getGradient(defaults.theme);
            console.log(theme.multiline(data));
          }
          console.log("\n🚀 " + byteMe.getRandomMessage());
        });
      });
    } else {
      console.log("\n🚀 " + byteMe.getRandomMessage());
    }
  });

program
  .command("dungeon")
  .description("Enter the ASCII dungeon adventure 🏰")
  .action(() => runDungeon());

program
  .command("hack")
  .description("Run a secret hack & mini-game 🕹️")
  .action(() => {
    runFakeHackGame();
  });

// --- ASCII Adventure game ---
program
  .command("adventure")
  .description("Start the 10-Level ASCII Adventure 🌲")
  .action(() => asciiAdventure10());

program
  .command("rps")
  .description("Play Rock-Paper-Scissors 🎮")
  .action(() => rpsGame());

// --- Root action: runs when no command is given ---
program.action(() => {
  const options = program.opts();
  byteMe({
    cronTime: options.test ? "*/5 * * * * *" : "0 */30 * * * *",
    rainbow: options.rainbow || false,
    notify: options.notify || false,
    once: options.once || false,
  });
});

// --- Parse options and commands ---
program.parse(process.argv);
