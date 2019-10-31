import { useState } from "../core/core";
import { fps } from "../core/utils";
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
			data =>
				(ready = 1) && setView(() => (def in data ? data[def] : data))
		);
		fps(() => !ready && setView(() => ({ loading }) => loading));
	});
	return view;
}
