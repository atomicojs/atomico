import { useRender, useHost } from "../hooks";
import { isFunction } from "../utils";
import { toChannel } from "./utils";

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
	let next = useRender();
	if (!ref[eventType]) {
		let list = [];
		ref[eventType] = [
			isFunction(initialState) ? initialState() : initialState,
			nextState => {
				let length = list.length;
				ref[eventType][0] = isFunction(nextState)
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
	let next = useRender();
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
