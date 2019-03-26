import { createElement } from "./vnode";
export { toList } from "./diff";
export { render } from "./render";

export let h = createElement;
export * from "./hooks";
export * from "./create-context";
