import { vnode } from "./vnode";
import { CONTEXT } from "./constants";

// incremental id to identify contexts
let counterID = 0;
/**
 * allows the manipulation of the context based on the reading of ShadowContext
 * @param {array}
 * @return {object}
 */
function ShadowContext({ children }) {
    return children[0];
}
/**
 * create a context with a reserved space name at the time of the instance
 * This name is not unique, it is based on the @context.${counterID++}.
 */
export function createContext(valueDefault) {
    let space = CONTEXT + "." + counterID++;
    // manipulate the context property using ShadowContext as a proxy component
    function Provider({ value, children }) {
        return vnode(
            ShadowContext,
            { context: { [space]: value || valueDefault } },
            children
        );
    }
    // consumes the context from context based on the name of space
    function Consumer({ children }, context) {
        return children[0](context[space]);
    }
    // returns the context name of the context
    function toString() {
        return space;
    }
    return { Provider, Consumer, toString };
}
