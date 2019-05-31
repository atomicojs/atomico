export let options = {
	/**
	 * @return {string} pathname
	 */
	pathname() {
		return location.pathname;
	},
	/**
	 * Dispatch history a new pathname
	 * @type {Redirect}
	 */
	redirect(pathname) {
		if (pathname == options.pathname()) return;
		history.pushState({}, "history", pathname);
		//history.go(history.length);
		window.dispatchEvent(new PopStateEvent("popstate"));
	},
	subscribe(handler) {
		window.addEventListener("popstate", handler);
		return () => window.removeEventListener("popstate", handler);
	}
};
