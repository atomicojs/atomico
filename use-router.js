import './chunk/utils.js';
import { useState, useEffect } from './core.js';

/**
 * @return {string} pathname
 */
function getPathname() {
	return location.pathname;
}
/**
 * Dispatch history a new pathname
 * @type {Redirect}
 */
function redirect(pathname) {
	if (pathname == getPathname()) return;
	history.pushState({}, "history", pathname);
	window.dispatchEvent(new PopStateEvent("popstate"));
}

function subscribe(handler) {
	window.addEventListener("popstate", handler);
	return () => window.removeEventListener("popstate", handler);
}

const FOLDERS = /([^\/]+)/g;
const FOLDER = "[^\\/]";
const SPLIT = "(?:\\/){0,1}";
const PARAM = /^(:)(\w+)(\?|(\.){3}){0,1}/;
const PARAMS_EMPTY = {};
const MEMO = {};

function format(path) {
	return path.replace(/(\/){2,}/g, "/").replace(/([^\/]+)\/$/, "$1");
}

function parse(string) {
	let folders = string.match(FOLDERS) || [""];
	let params = [];
	let regexp = new RegExp(
		"^" +
			folders
				.map(folder => {
					let [string, param, field, type] =
						folder.match(PARAM) || [];
					if (param) {
						params.push(field);
						if (type === "...") {
							return `(.*)`;
						} else if (type === "?") {
							return `${SPLIT}(${FOLDER}*)`;
						} else {
							return `\\/(${FOLDER}+)`;
						}
					} else {
						return `\\/(?:${folder
							.replace(/(\.|\-)/g, "\\$1")
							.replace(/\*/g, FOLDER + "+")
							.replace(/\((?!\?\:)/g, "(?:")})`;
					}
				})
				.join("") +
			"$",
		"i"
	);

	return { regexp, params, logs: {} };
}
/**
 * permite comparar un patron de captura vs un ruta de entrada
 * @param {string} path - ruta de patron de captura
 * @param {string} value  - ruta de comparacion a patron
 * @return {array} - [ inRoute:boolean, params:object ];
 */
function match(path, value) {
	path = format(path);
	value = format(value);
	if (!MEMO[path]) {
		MEMO[path] = parse(path);
	}
	let { regexp, params, logs } = MEMO[path];
	if (logs[value]) {
		return logs[value];
	}
	let vs = value.match(regexp);
	return (logs[value] = [
		vs ? true : false,
		vs
			? vs.slice(1).reduce((next, value, index) => {
					next[params[index] || index] = value;
					return next;
			  }, {})
			: PARAMS_EMPTY
	]);
}

let cachePathCallback = {};

function useHistory() {
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

function useMatchRoute(path) {
	return match(path, getPathname());
}

function useRoute(path) {
	useHistory();
	return useMatchRoute(path);
}

function useRedirect(path) {
	return (cachePathCallback[path] =
		cachePathCallback[path] || (() => redirect(path)));
}

function useRouter(cases) {
	let def = "default";
	let [pathname] = useHistory();
	for (let key in cases) {
		if (key != def) {
			let [status, params] = match(key, pathname);
			if (status) return cases[key](params);
		}
	}
	return cases[def];
}

export { useHistory, useMatchRoute, useRedirect, useRoute, useRouter };
//# sourceMappingURL=use-router.js.map
