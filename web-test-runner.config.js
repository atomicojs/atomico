const { esbuildPlugin } = require("@web/dev-server-esbuild");

module.exports = {
    rootDir: "../../..",
    nodeResolve: true,
    plugins: [
        esbuildPlugin({ jsx: true, jsxFactory: "h", jsxFragment: "Fragment" }),
    ],
};
