module.exports = function(config) {
    config.set({
        frameworks: ["mocha", "chai"],
        files: [
            {
                pattern: "test/**/*.test.js",
                watched: true
            }
        ],
        preprocessors: {
            "test/**/*.js": ["rollup"]
        },
        rollupPreprocessor: {
            plugins: [
                require("rollup-plugin-babel")({
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                targets: {
                                    chrome: "60"
                                }
                            }
                        ],
                        [
                            "@babel/preset-react",
                            {
                                pragma: "h",
                                throwIfNamespace: false
                            }
                        ]
                    ]
                })
            ],
            output: {
                format: "iife", // Helps prevent naming collisions.
                name: "test", // Required for 'iife' format.
                sourcemap: "inline" // Sensible for testing.
            }
        },
        reporters: ["progress"],
        port: 9876, // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ["ChromeHeadless"],
        autoWatch: false,
        // singleRun: false, // Karma captures browsers, runs the tests and exits
        concurrency: Infinity
    });
};
