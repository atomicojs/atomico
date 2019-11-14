/**
 * @return {string} pathname
 */
export function getPathname() {
    return location.pathname;
}
/**
 * Dispatch history a new pathname
 * @type {Redirect}
 */
export function redirect(pathname) {
    if (pathname == getPathname()) return;
    history.pushState({}, "history", pathname);
    window.dispatchEvent(new PopStateEvent("popstate"));
}

export function subscribe(handler) {
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
}
