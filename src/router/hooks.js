import { useState, useEffect, useMemo } from "@atomico/core";
import { options } from "./options";
import { match } from "./parse";

export function useHistory() {
	let pathname = options.pathname();
	let [state, setState] = useState({ pathname });

	useEffect(() => {
		function handler() {
			let pathname = options.pathname();
			if (state.pathname != pathname) {
				state.pathname = pathname;
				setState(state);
			}
		}
		return options.subscribe(handler);
	}, []);
	return [pathname, options.redirect];
}

export function useMatchRoute(path) {
	return match(path, options.pathname());
}

export function useRoute(path) {
	useHistory();
	return useMatchRoute(path);
}

export function useRedirect(path) {
	let redirect = options.redirect;
	return useMemo(() => (path ? path => redirect(path) : redirect), [
		path,
		redirect
	]);
}
