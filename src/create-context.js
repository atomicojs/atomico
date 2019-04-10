import { CONTEXT } from "./constants";
import { assign } from "./utils";
import { getCurrentComponent } from "./component";

let counter = 0;

export function useContext({ id, defaultValue }) {
	let context = getCurrentComponent().context || {};
	return id in context ? context[id] : defaultValue;
}

export function createContext(defaultValue) {
	let id = CONTEXT + counter++,
		Context = { Provider, Consumer, id, defaultValue };

	function Provider({ value, children }) {
		let snap = getCurrentComponent();
		if (snap.context[id] != value) {
			snap.context = assign({}, snap.context, {
				[id]: value
			});
		}
		return children;
	}
	function Consumer({ children }) {
		return children(useContext(Context));
	}
	return Context;
}
