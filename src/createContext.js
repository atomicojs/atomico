import { vnode } from "./vnode";
import { CONTEXT } from "./constants";

let counter = 0;

function ShadowContext({ children }) {
    return children[0];
}

export function createContext() {
    let space = CONTEXT + "." + counter++;

    function Provider({ value, children }) {
        return vnode(ShadowContext, { [space]: value }, children);
    }
    function Consumer({ props, children }, context) {
        return children[0](context[space]);
    }
    function toString() {
        return space;
    }
    return { Provider, Consumer, toString };
}
