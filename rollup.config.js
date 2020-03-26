import resolve from "@rollup/plugin-node-resolve";

export default {
    input: ["src/core/core.js", "src/html.js"],
    output: [
        {
            dir: "./",
            format: "es",
            chunkFileNames: "chunk/[name].js",
            sourcemap: true
        },
        {
            dir: "./cjs",
            format: "cjs",
            chunkFileNames: "chunk/[name].js",
            sourcemap: true
        }
    ],
    plugins: [resolve()]
};
