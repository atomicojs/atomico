/**
 * @type {import("@web/test-runner").TestRunnerConfig}
 */
const config = {
    files: ["{src,html,tests,ssr}/**/*.test.js"],
    nodeResolve: true,
    coverage: true,
    coverageConfig: {
        exclude: ["./html.js", "./html/**/*", "./node_modules/**/*"]
    }
};

export default config;
