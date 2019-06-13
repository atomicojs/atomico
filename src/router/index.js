import { createElement, useMemo, toList } from "../core";
import { useHistory } from "./hooks";
import { match } from "./parse";
export { options } from "./options";
export * from "./hooks";

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
