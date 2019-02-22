import pkg from "./package.json";
import buble from "rollup-plugin-buble";
import { terser } from "rollup-plugin-terser";

export default {
    input: pkg.source,
    output: [
        {
            file: pkg.main,
            sourcemap: true,
            format: "umd",
            name: "bundle"
        }
    ],
    plugins: [
        buble({
            jsx: "h",
            objectAssign: "Object.assign"
        }),
        terser()
    ]
};
