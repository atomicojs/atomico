import { useState, useEffect } from "../core";
import { redirect, getPathname, subscribe } from "./location";
import { match } from "./parse";

let cachePathCallback = {};

export function useHistory() {
	let pathname = getPathname();
	let [state, setState] = useState({ pathname });

	useEffect(() => {
		function handler() {
			let pathname = getPathname();
			if (state.pathname != pathname) {
				state.pathname = pathname;
				setState(state);
			}
		}
		return subscribe(handler);
	}, []);
	return [pathname, redirect];
}

export function useMatchRoute(path) {
	return match(path, getPathname());
}

export function useRoute(path) {
	useHistory();
	return useMatchRoute(path);
}

export function useRedirect(path) {
	return (cachePathCallback[path] =
		cachePathCallback[path] || (() => redirect(path)));
}
