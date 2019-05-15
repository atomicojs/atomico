import { getCurrentComponent, useHook } from "./component.js";

import { isEqualArray, defer, isFunction } from "./utils.js";

import {
	COMPONENT_CREATE,
	COMPONENT_CREATED,
	COMPONENT_UPDATE,
	COMPONENT_UPDATED,
	COMPONENT_REMOVE
} from "./constants.js";

/**
 * @return {HTMLElement}
 */
export function useHost() {
	return getCurrentComponent().component.ref;
}

export function useState(initialState) {
	/**@type {RefUseState} */
	let ref = useHook(0, [])[0];
	if (!ref[1]) {
		let next = getCurrentComponent().next;
		ref.push(
			isFunction(initialState) ? initialState() : initialState,
			function setState(nextState) {
				ref[0] = isFunction(nextState) ? nextState() : nextState;
				next();
			}
		);
	}
	return ref;
}

export function useEffect(callback, args) {
	useHook((state, action) => {
		switch (action.type) {
			case COMPONENT_CREATE:
				return { args };
			case COMPONENT_UPDATE:
			case COMPONENT_REMOVE:
				if (state.clear) {
					let next =
						action.type == COMPONENT_REMOVE ||
						(args && state.args ? !isEqualArray(args, state.args) : true);
					if (next) state.clear.then(handler => handler && handler());
				}
				return { args };
			case COMPONENT_CREATED:
			case COMPONENT_UPDATED:
				let next =
						action.type == COMPONENT_CREATED ||
						(args && state.args ? !isEqualArray(args, state.args) : true),
					clear = state.clear;
				if (next) {
					clear = defer(callback);
				}
				return { clear, args };
		}
		return state;
	});
}

export function useRef(current) {
	return useHook(0, { current })[0];
}

export function useMemo(callback, args) {
	let ref = useHook(0, [])[0];
	if (!ref[0] || (ref[0] && !isEqualArray(ref[0], args))) {
		ref[1] = callback();
	}
	ref[0] = args;
	return ref[1];
}

export function useReducer(reducer, initialState) {
	/** @type {RefUseReducer} */
	let ref = useHook(0, [])[0];
	if (!ref.current) {
		let next = getCurrentComponent().next;
		ref.push(initialState, (state, action) => {
			ref[0] = ref[2](state, action);
			next();
		});
	}
	ref[2] = reducer;
	return ref;
}

/**
 * @typedef {function(*,*):void} SetState - **setState( nextState )**
 *
 * @typedef {[*, SetState]} RefUseState - **[state, setState]**
 *
 * @typedef {[*, import("./component").Dispatch]} RefUseReducer - **[state, dispatch]**
 **/
