import { customElement as coreCustomElement } from "../core/core";
import { createHookCollection } from "../core/hooks";
function id() {
    return (Math.random() + "").replace(/\d+\./, "");
}

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function customElement(wc) {
    let nodeName = `wc-${id()}`;
    coreCustomElement(nodeName, wc);
    return () => document.createElement(nodeName);
}

export function customElementScope(wc) {
    return customElement(wc)();
}

export function elementScope() {
    let node = document.createElement("div");
    node.id = `id-${id()}`;
    return node;
}

export function createRenderHook() {
    let cycle = 0;
    let lastRender;

    function rerender() {
        if (lastRender) {
            let [callback, arg] = lastRender;
            hook.load(callback.bind(null, null, cycle++), arg);
            hook.updated();
        }
    }

    let hook = createHookCollection(rerender);

    return function render(...args) {
        lastRender = args;
        rerender();
    };
}
