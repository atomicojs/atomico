// export { render } from "./update";
// export { h } from "./vnode";
// export { options } from "./options";
// export { setTask } from "./utils";
// export { useEffect, useState, useRef, useMemo, useReducer } from "./hooks";
// export { createContext, useContext } from "./createContext";

import { createElement } from "./vnode";
export { toChildren } from "./diff";
export { render } from "./render";

export let h = createElement;
export * from "./hooks";
export * from "./create-context";
