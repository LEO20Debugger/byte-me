import copy from "rollup-plugin-copy";

export default [
  // ESM build
  {
    input: "src/index.js",
    output: {
      file: "dist/esm/index.js",
      format: "esm",
    },
  },
  // Copy messages.json to dist/json/
  {
    input: "src/index.js", // dummy input (required by Rollup)
    plugins: [
      copy({
        targets: [{ src: "src/json/messages.json", dest: "dist/json" }],
      }),
    ],
  },
];
