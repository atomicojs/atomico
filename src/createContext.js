import { CONTEXT } from "./constants";
import { createVnode } from "./vnode";
import { getCurrentSnap } from "./component";

let counter = 0;

let defaultValues = {};

function Context(props) {
    return props.children[0];
}

export function useContext(nameSpace) {
    let context = getCurrentSnap().context;
    return nameSpace in context ? context[nameSpace] : defaultValues[nameSpace];
}

export function createContext(defaultValue) {
    let nameSpace = CONTEXT + counter++;
    defaultValues[nameSpace] = defaultValue;
    function Provider({ value, children }) {
        return createVnode(
            Context,
            { context: { [nameSpace]: value } },
            children
        );
    }
    function Consumer({ children }) {
        return children[0](useContext(nameSpace));
    }
    function toString() {
        return nameSpace;
    }
    return { Provider, Consumer, toString };
}
