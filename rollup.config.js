import { defineConfig } from "rollup";
import resolve from "@rollup/plugin-node-resolve";

export default defineConfig({
    input: ["html/html.js"],
    output: [
        {
            dir: "./",
            format: "es",
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
                if ("../src/core.js" == id) {
                    return {
                        id: "./src/core.js",
                        external: true,
                    };
                }
            },
        },
        resolve(),
    ],
});
