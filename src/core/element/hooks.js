import { useHost } from "../hooks";
import { dispatchEvent } from "./utils";

export function useProp(name) {
	let ref = useHost();
	if (name in ref.current) {
		let alias = "_" + name;
		if (!ref[alias]) {
			ref[alias] = [null, nextValue => (ref.current[name] = nextValue)];
		}
		ref[alias][0] = ref.current[name];
		return ref[alias];
	}
}

export function useEvent(type, customEventInit) {
	let ref = useHost();
	if (!ref[type]) {
		ref[type] = detail =>
			dispatchEvent(
				ref.current,
				type,
				detail ? { ...customEventInit, detail } : customEventInit
			);
	}
	return ref[type];
}
