import { getCurrentComponent, useHook } from "../core/component";

/**
 * @return {HTMLElement}
 */
export function useHost() {
	let com = getCurrentComponent().component;
	return useHook(0, {
		get current() {
			com.ref.current;
		}
	});
}

export function useObservable(name) {
	let ref = useHost();
	if (name in ref.current) {
		if (!ref.set) {
			ref.set = nextValue => (ref.current[name] = nextValue);
		}
		return [ref.current, ref.set];
	}
}

export function useDispatchEvent(name) {
	let ref = useHost();
}
