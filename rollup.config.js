import buble from "rollup-plugin-buble";
import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import filesize from "rollup-plugin-filesize";
import pkg from "./package.json";

export default [
    {
        input: pkg.source,
        output: [
            {
                file: pkg.main,
                format: "cjs",
                sourcemap: true
            },
            {
                file: pkg.module,
                format: "es",
                sourcemap: true
            },
            {
                file: pkg["umd:main"],
                format: "umd",
                name: pkg.name,
                sourcemap: true
            }
        ],
        plugins: [
            resolve(),
            buble({
                transforms: {
                    classes: false
                },
                objectAssign: "Object.assign"
            }),
            terser(),
            filesize()
        ]
    },
    {
        input: pkg.source,
        output: [
            {
                file: pkg["umd:es5"],
                format: "umd",
                name: pkg.name,
                sourcemap: true
            }
        ],
        plugins: [
            resolve(),
            buble({
                objectAssign: "Object.assign"
            }),
            terser(),
            filesize()
        ]
    }
];
