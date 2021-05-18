const { createDefaultConfig } = require("@open-wc/testing-karma");
const merge = require("deepmerge");

module.exports = (config) => {
    config.set(
        merge(createDefaultConfig(config), {
            files: [
                {
                    pattern: "src/**/*.test.js",
                    type: "module",
                },
                {
                    pattern: "html/**/*.test.js",
                    type: "module",
                },
            ],
            esm: {
                nodeResolve: true,
            },
            coverageReporter: {
                check: {
                    global: {
                        statements: 90,
                        lines: 90,
                        branches: 70,
                        functions: 90,
                    },
                },
            },
        })
    );
    return config;
};
