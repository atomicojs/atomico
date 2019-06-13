import { getCurrentComponent, useHook } from "../core/component";

/**
 * @return {HTMLElement}
 */
export function useHost() {
	let component = getCurrentComponent().component;
	return useHook(0, {
		get current() {
			return component.host;
		}
	})[0];
}

export function useObservable(name) {
	let ref = useHost();
	if (name in ref.current) {
		if (!ref.set) {
			ref.set = nextValue => (ref.current[name] = nextValue);
		}
		return [ref.current[name], ref.set];
	}
}

export function useEvent(name, customEventInit) {
	let ref = useHost();
	if (!ref.on) {
		ref.on = detail => {
			ref.current.dispatchEvent(
				new CustomEvent(
					name,
					detail ? { ...customEventInit, detail } : customEventInit
				)
			);
		};
	}
	return ref.on;
}
