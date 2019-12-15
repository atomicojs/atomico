import { customElement as coreCustomElement } from "../core/core";

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
