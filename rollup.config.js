import pkg from "./package.json";
import buble from "rollup-plugin-buble";
import { terser } from "rollup-plugin-terser";
import size from "rollup-plugin-bundle-size";
export default [
	{
		input: pkg.source,
		output: {
			file: pkg.module,
			format: "es"
		},
		plugins: [size()]
	},
	{
		input: pkg.source,
		output: {
			file: pkg.unpkg,
			sourcemap: true,
			format: "umd",
			name: pkg.name
		},
		plugins: [
			buble({
				jsx: "h",
				objectAssign: "Object.assign"
			}),
			terser({
				compress: {
					keep_infinity: true,
					pure_getters: true,
					passes: 10
				}
			}),
			size()
		]
	}
];
