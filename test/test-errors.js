import { scheduleFun } from "../src/index.js";

// Start the scheduler so you also see normal messages
scheduleFun({ once: false });

// --- Trigger uncaught exception ---
setTimeout(() => {
  throw new Error("Test uncaught exception!");
}, 1000);

// --- Trigger unhandled promise rejection ---
setTimeout(() => {
  Promise.reject("Test unhandled rejection!");
}, 2000);

// Trigger a runtime warning after 3 seconds
setTimeout(() => {
  process.emitWarning("This is a test runtime warning!");
}, 3000);
