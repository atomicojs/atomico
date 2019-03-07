import { CONTEXT } from "./constants";
import { createVnode } from "./vnode";
import { getCurrentSnap } from "./component";

let counter = 0;

function Context(props) {
    return props.children[0];
}

export function useContext(Context) {
    let context = getCurrentSnap().context || {};
    return Context in context ? context[Context] : Context.defaultValue;
}

export function createContext(defaultValue) {
    let nameSpace = CONTEXT + counter++,
        context = { Provider, Consumer, toString, defaultValue };

    function Provider({ value, children }) {
        return createVnode(
            Context,
            { context: { [nameSpace]: value } },
            children
        );
    }
    function Consumer({ children }) {
        return children[0](useContext(context));
    }
    function toString() {
        return nameSpace;
    }
    return context;
}
