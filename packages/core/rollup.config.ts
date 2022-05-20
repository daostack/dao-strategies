import sourceMaps from "rollup-plugin-sourcemaps";
import typescript from "rollup-plugin-typescript2";

const pkg = require("./package.json");

const libraryName = "dao-strategies-core";

export default {
  input: `src/${libraryName}.ts`,
  output: [
    { file: pkg.module, name: libraryName, format: "es", sourcemap: true },
    { file: pkg.main, name: libraryName, format: "umd", sourcemap: true },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  watch: {
    buildDelay: 1000,
    include: "src/**",
  },
  plugins: [
    typescript({
      abortOnError: false,
      useTsconfigDeclarationDir: true,
      cacheRoot: `${require("temp-dir")}/.rpt2_cache`,
      tsconfig: "./tsconfig.build.json"
    }),

    // Resolve source maps to the original source
    sourceMaps(),
  ],
};
