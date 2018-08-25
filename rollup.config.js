import buble from "rollup-plugin-buble";
import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

export default {
    input: "src/index.js",
    output: [
        {
            file: "dist/atomico.js",
            format: "cjs",
            sourcemap: true
        },
        {
            file: "dist/atomico.m.js",
            format: "es",
            sourcemap: true
        },
        {
            file: "dist/atomico.umd.js",
            format: "umd",
            name: "Atomico",
            sourcemap: true
        }
    ],
    external: ["preact"],
    plugins: [
        resolve(),
        buble({
            transforms: {
                classes: false
            },
            objectAssign: "Object.assign"
        }),
        terser()
    ]
};
