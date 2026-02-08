import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["esm"],
  outDir: "bin", 
  dts: true,
  splitting: false,            // Optional code splitting setting
  clean: true,                 // Clean dist directory
  sourcemap: true,             // Generate source maps
});