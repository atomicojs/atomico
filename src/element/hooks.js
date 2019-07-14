import { getCurrentComponent, useHook } from "../core/component";
import { toChannel } from "./utils";
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

export function useProp(name) {
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
	if (!ref[name]) {
		ref[name] = detail => {
			ref.current.dispatchEvent(
				new CustomEvent(
					name,
					detail ? { ...customEventInit, detail } : customEventInit
				)
			);
		};
	}
	return ref[name];
}

export function useProvider(channel, initialState) {
	let ref = useHost();
	let eventType = toChannel(channel);
	let next = getCurrentComponent().next;
	if (!ref[eventType]) {
		let list = [];
		ref[eventType] = [
			typeof initialState == "function" ? initialState() : initialState,
			nextState => {
				let length = list.length;
				ref[eventType][0] =
					typeof nextState == "function"
						? nextState(ref[eventType])
						: nextState;
				for (let i = 0; i < length; i++) list[i](ref[eventType]);
				next();
			}
		];
		ref.current.addEventListener(eventType, event => {
			event.stopPropagation();
			list.push(event.detail);
			event.detail(ref[eventType]);
		});
	}
	return ref[eventType];
}

export function useConsumer(channel, handler) {
	let next = getCurrentComponent().next;
	let ref = useHost();
	let eventType = toChannel(channel);
	let dispatchEvent = useEvent(eventType, {
		composed: true,
		bubbles: true
	});

	if (!ref[eventType]) {
		let setParentState;
		ref[eventType] = [
			null,
			nextState => {
				setParentState(nextState);
			}
		];
		dispatchEvent(
			handler ||
				(([state, setState]) => {
					if (setParentState) next();
					ref[eventType][0] = state;
					setParentState = setState;
				})
		);
	}
	return ref[eventType];
}
