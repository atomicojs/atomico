import { getCurrentComponent, useHook } from "./component";

import { isEqualArray, assign, defer } from "./utils";

import {
	COMPONENT_CREATE,
	COMPONENT_CREATED,
	COMPONENT_UPDATE,
	COMPONENT_UPDATED,
	COMPONENT_REMOVE
} from "./constants";

export function useState(initialState) {
	let next = getCurrentComponent().next,
		type = 0x9f;
	let [state, dispatch] = useHook((state, action) => {
		switch (action.type) {
			case COMPONENT_CREATE:
				return typeof initialState == "function"
					? initialState()
					: initialState;
			case type:
				let nextState = action.state;
				return typeof nextState == "function" ? nextState(state) : nextState;
		}
		return state;
	});
	return [
		state,
		state => {
			dispatch({ state, type });
			next();
		}
	];
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
				return assign({}, state, { args });
			case COMPONENT_CREATED:
			case COMPONENT_UPDATED:
				let next =
						action.type == COMPONENT_CREATED ||
						(args && state.args ? !isEqualArray(args, state.args) : true),
					clear = state.clear;
				if (next) {
					clear = defer(callback);
				}
				return assign({}, state, { clear, args });
		}
		return state;
	});
}

export function useRef(current) {
	let [state] = useHook(false, {});
	return state;
}

export function useMemo(callback, args) {
	let [state] = useHook((state, action) => {
		switch (action.type) {
			case COMPONENT_CREATE:
			case COMPONENT_UPDATE:
				return {
					args,
					value:
						action.type == COMPONENT_CREATE
							? callback()
							: isEqualArray(args, state.args)
							? state.value
							: callback()
				};
		}
		return state;
	});
	return state.value;
}

export function useReducer(reducer, initialState) {
	let next = getCurrentComponent().next,
		type = 0x9e;
	let [state, dispatch] = useHook((state, action) => {
		switch (action.type) {
			case COMPONENT_CREATE:
				return initialState;
			case type:
				return reducer(state, action.use);
		}
		return state;
	});
	return [
		state,
		use => {
			dispatch({ type, use });
			next();
		}
	];
}
