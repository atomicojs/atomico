import './chunk/utils.js';
import { useState } from './core.js';

/**
 * It allows to load a component asynchronously.
 * @param {Function} callback
 * @param {object} [props]
 */
function useLazy(callback) {
	let [view, setView] = useState(() => {
		let ready;
		callback().then(({ default: view }) => (ready = 1) && setView(view));
		fps(() => !ready && setView(({ loading }) => loading));
		return "";
	});
	return view;
}

function fps(callback, count = 3) {
	count-- ? requestAnimationFrame(() => fps(callback, count)) : callback();
}

export { useLazy };
//# sourceMappingURL=use-lazy.js.map
