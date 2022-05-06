import { jsx } from "../jsx-runtime.js";
import { build, evaluate } from "htm/src/build.mjs";

const CACHE = new Map();

export function html(statics) {
    let tmp = CACHE;

    tmp = evaluate(
        jsx,
        tmp.get(statics) || (tmp.set(statics, (tmp = build(statics))), tmp),
        arguments,
        []
    );

    return tmp.length > 1 ? tmp : tmp[0];
}
