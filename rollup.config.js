import sizes from "@atomico/rollup-plugin-sizes";
import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve";
import pkg from "./package.json";

export default {
	input: [
		"src/core/core.js",
		"src/html.js",
		"src/use-lazy/use-lazy.js",
		"src/use-router/use-router.js",
		"src/use-state-generator/use-state-generator.js"
	],
	output: {
		dir: "./",
		format: "es",
		chunkFileNames: "chunk/[name].js",
		sourcemap: true
	},
	plugins: [
		resolve(),
		...(process.env.ROLLUP_WATCH
			? []
			: [
					terser({
						sourcemap: true
					}),
					sizes()
			  ])
	]
};
