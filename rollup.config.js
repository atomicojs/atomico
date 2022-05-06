import { defineConfig } from "rollup";
import resolve from "@rollup/plugin-node-resolve";

export default defineConfig({
    input: ["html/html.js"],
    output: [
        {
            dir: "./",
            format: "es",
            banner: `import { jsx } from "./jsx-runtime.js"`,
        },
    ],
    plugins: [
        {
            name: "local",
            /**
             * prevents html from generating an additional chunk
             * that separates shared elements, thus depending
             * only on the core
             * @param {string} id
             */
            resolveId(id) {
                if ("../src/render.js" == id) {
                    return {
                        id: "./src/render.js",
                        external: true,
                    };
                }
            },
            transform(code, id) {
                return {
                    code: code.replace(/\(this/g, "(jsx"),
                };
            },
        },
        resolve(),
    ],
});
