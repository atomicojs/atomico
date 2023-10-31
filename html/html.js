import { build, evaluate } from "htm/src/build.mjs";
import { createElement } from "../src/core.js";

const CACHE = new Map();

export function html(statics) {
    let tmp = CACHE;

    tmp = evaluate(
        createElement,
        tmp.get(statics) || (tmp.set(statics, (tmp = build(statics))), tmp),
        arguments,
        [],
    );

    return tmp.length > 1 ? tmp : tmp[0];
}
