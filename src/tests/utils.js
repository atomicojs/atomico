import { customElement as coreCustomElement } from "../core/core";

export function customElement(wc) {
	let nodeName = `wc-${(Math.random() + "").replace(/\d+\./, "")}`;
	coreCustomElement(nodeName, wc);
	return () => document.createElement(nodeName);
}

export function customElementScope(wc) {
	return customElement(wc)();
}
