import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy";

export default {
  input: "src/index.js",
  output: {
    dir: "dist",
    format: "esm",
    entryFileNames: "index.js",
    sourcemap: true,
  },
  plugins: [
    json(), // ⬅️ lets you import messages.json directly into code

    copy({
      targets: [
        { src: "src/bin/*", dest: "dist/bin" }, // still need CLI entry
        { src: "src/postinstall.js", dest: "dist" }, // only if you still want it separate
      ],
      hook: "writeBundle",
    }),
  ],
  external: [
    "chalk",
    "chalk-animation",
    "commander",
    "concurrently",
    "figlet",
    "gradient-string",
    "node-cron",
    "node-notifier",
    "npmlog",
    "fs",
    "path",
    "url",
    "process",
    "os",
    "readline",
  ],
};
