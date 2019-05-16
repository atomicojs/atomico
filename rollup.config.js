import pkg from "./package.json";
import { terser } from "rollup-plugin-terser";
import { sizeSnapshot } from "rollup-plugin-size-snapshot";
export default [
	{
		input: pkg.source,
		output: {
			file: pkg.module,
			format: "es"
		},
		plugins: [sizeSnapshot()]
	},
	{
		input: pkg.source,
		output: {
			file: pkg.module.replace(/js$/, "min.js"),
			sourcemap: true,
			format: "es"
		},
		plugins: [terser(), sizeSnapshot()]
	}
];
