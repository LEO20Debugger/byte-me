#!/usr/bin/env node
import { pastel } from "gradient-string";
import figlet from "figlet";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

figlet("Byte Me!", (err, data) => {
  if (err) return;
  console.log(pastel.multiline(data));
  console.log("\n🚀 Thanks for installing Byte Me!");
  console.log("💡 Run `byte-me` to start getting fun messages anytime\n");

  // Wrap path in quotes for Windows
  const cliPath = `"${join(__dirname, "cli.js")}"`;

  spawn("node", [cliPath, "--once"], {
    stdio: "inherit",
    shell: true, // ensures compatibility on Windows
  });
});
