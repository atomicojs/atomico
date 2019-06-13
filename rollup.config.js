import sizes from "@atomico/rollup-plugin-sizes";
import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve";
import pkg from "./package.json";

export default {
	input: ["src/index.js", "src/lazy.js", "src/router.js", "src/html.js"],
	external: Object.keys(pkg.dependencies),
	output: {
		dir: "./",
		format: "es",
		chunkFileNames: "core.js",
		sourcemap: true
	},
	plugins: [resolve(), terser(), sizes()]
};
