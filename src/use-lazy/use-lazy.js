import { useState } from "../core/core";

/**
 * It allows to load a component asynchronously.
 * @param {Function} callback
 * @param {object} [props]
 */
export function useLazy(callback) {
	let [view, setView] = useState(() => {
		let ready;
		let def = "default";
		callback().then(
			data => (ready = 1) && setView(def in data ? data[def] : view)
		);
		fps(() => !ready && setView(({ loading }) => loading));
		return "";
	});
	return view;
}

function fps(callback, count = 3) {
	count-- ? requestAnimationFrame(() => fps(callback, count)) : callback();
}
