import { createElement, useMemo, toList } from "../core/index.js";
import { useHistory } from "./hooks.js";
import { match } from "./parse.js";
export { options } from "./options.js";
export * from "./hooks.js";

export function Router({ children }) {
	let [pathname] = useHistory();
	let nextChild;
	let nextParams;

	children = useMemo(() => toList(children), [children]);

	let length = children.length;

	for (let i = 0; i < length; i++) {
		let child = children[i];
		let props = child.props;
		if (props.path) {
			let [inRoute, params] = match(child.props.path, pathname);
			if (inRoute) {
				nextChild = child;
				nextParams = params;
				break;
			}
		}
		if (child.props.default) {
			nextChild = child;
		}
	}

	if (nextChild) {
		let { type, props } = nextChild;
		let nextProps = { ...props, params: nextParams };
		delete nextProps.path;
		delete nextProps.default;
		return createElement(type, nextProps);
	}
}
