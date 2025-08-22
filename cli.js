#!/usr/bin/env node
import { Command } from "commander";
import { scheduleFun } from "./index.js";

const program = new Command();

program
  .name("byte-me")
  .description("A fun CLI that surprises you with random geeky messages 🚀")
  .option("-t, --test", "Run every 5 seconds (for testing)")
  .option("-r, --rainbow", "Enable rainbow animated messages 🌈")
  .option("-n, --notify", "Show system notifications 🔔")
  .option("-o, --once", "Show one message and exit")
  .parse(process.argv);

const options = program.opts();

scheduleFun({
  cronTime: options.test ? "*/5 * * * * *" : "0 */30 * * * *", // test: every 5s
  rainbow: options.rainbow || false,
  notify: options.notify || false,
  once: options.once || false,
});
