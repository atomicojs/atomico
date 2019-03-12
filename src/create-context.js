import { CONTEXT } from "./constants";
import { assign } from "./utils";
import { getCurrentComponent } from "./component";

let counter = 0;

function Context(props) {
    return props.children;
}

export function useContext(Context) {
    let context = getCurrentComponent().context || {};
    return Context in context ? context[Context] : Context.defaultValue;
}

export function createContext(defaultValue) {
    let nameSpace = CONTEXT + counter++,
        context = { Provider, Consumer, toString, defaultValue };

    function Provider({ value, children }) {
        let snap = getCurrentComponent();
        if (context[nameSpace] != value) {
            snap.context = assign({}, snap.context, {
                [nameSpace]: value
            });
        }

        return children;
    }
    function Consumer({ children }) {
        return children(useContext(context));
    }
    function toString() {
        return nameSpace;
    }
    return context;
}
