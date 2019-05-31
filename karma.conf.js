/**
 * @link https://www.npmjs.com/package/karma-rollup-preprocessor
 */
module.exports = function(config) {
	config.set({
		frameworks: ["jasmine"],
		files: [
			{
				pattern: "**/*.test.js",
				watched: true
			}
		],
		preprocessors: {
			"**/*.test.js": ["rollup"]
		},
		rollupPreprocessor: {
			onwarn: function(message) {
				if (/Circular dependency/gi.test(message)) return;
				console.error(message);
			},
			plugins: [
				require("rollup-plugin-node-resolve")({
					extensions: [".js", ".ts"]
				}),
				require("rollup-plugin-sucrase")({
					production: true,
					exclude: ["node_modules/**"],
					jsxPragma: "h",
					transforms: ["typescript", "jsx"]
				})
			],
			output: {
				format: "iife", // Helps prevent naming collisions.
				name: "test", // Required for 'iife' format.
				sourcemap: "inline" // Sensible for testing.
			}
		},
		reporters: ["spec"],
		port: 9876, // karma web server port
		colors: true,
		logLevel: config.LOG_ERROR,
		browsers: ["ChromeHeadless"],
		autoWatch: false,
		// singleRun: false, // Karma captures browsers, runs the tests and exits
		concurrency: Infinity
	});
};
