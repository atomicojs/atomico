import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import sizes from "@atomico/rollup-plugin-sizes";

export default {
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
                if ("../core.js" == id) {
                    return {
                        id: "./core.js",
                        external: true,
                    };
                }
            },
        },
        resolve(),
        terser(),
        sizes(),
    ],
};
