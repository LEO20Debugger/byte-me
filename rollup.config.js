import commonjs from "@rollup/plugin-commonjs";

export default [
  {
    input: "src/index.js",
    output: {
      file: "dist/esm/index.js",
      format: "esm",
    },
  },
  {
    input: "src/index.js",
    output: {
      file: "dist/cjs/index.js",
      format: "cjs",
    },
    plugins: [commonjs()],
  },
  // CLI build (cli.js)
  {
    input: "src/bin/cli.js",
    output: {
      file: "dist/cjs/cli.js",
      format: "cjs",
      banner: "#!/usr/bin/env node", // <- keep CLI executable
    },
    plugins: [commonjs()],
  },
];
