import {
  scheduleFun,
  showErrorHint,
  getRandomMessage,
  showDailyTip,
} from "./lib/lib.js";

// Core function that runs scheduled messages
function byteMe(options = {}) {
  scheduleFun(options);

  // Global error handlers
  process.on("uncaughtException", (err) => showErrorHint(err));
  process.on("unhandledRejection", (reason) => showErrorHint(reason));
  process.on("warning", (warning) => showErrorHint(warning));
}

// Attach utility functions to the default export
const exportedByteMe = Object.assign(byteMe, {
  scheduleFun,
  getRandomMessage,
  showDailyTip,
});

// Named exports for direct usage in other projects
export { scheduleFun, showErrorHint, getRandomMessage, showDailyTip };

// Default export
export default exportedByteMe;
