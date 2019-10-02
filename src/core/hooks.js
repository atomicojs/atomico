import {
	HOOK_MOUNT,
	HOOK_UPDATE,
	HOOK_CURRENT,
	HOOK_MOUNTED,
	HOOK_UPDATED,
	HOOK_UNMOUNTED,
	ARRAY_EMPTY
} from "./constants";
import { isFunction, isEqualArray, defer } from "./utils";

function update(hook, type) {
	hook[0] && (hook[1] = hook[0](hook[1], type));
}

function updateAll(hooks, type) {
	for (let i in hooks) update(hooks[i], type);
}

export function useHook(reducer, initialState) {
	if (HOOK_CURRENT.hook) {
		return HOOK_CURRENT.hook.use(reducer, initialState)[1];
	}
}

export function useRender() {
	return HOOK_CURRENT.render;
}

export function useHost() {
	return useHook(0, { current: HOOK_CURRENT.host })[1];
}

export function createHookCollection(render, host) {
	let hooks = {};
	let mounted;
	let hook = {
		use,
		load,
		clean,
		hooks
	};
	function load(callback, param) {
		HOOK_CURRENT.index = 0;
		HOOK_CURRENT.hook = hook;
		HOOK_CURRENT.host = host;
		HOOK_CURRENT.render = render;
		let resolve = callback(param);

		updateAll(hooks, mounted ? HOOK_UPDATED : HOOK_MOUNTED);

		mounted = 1;
		HOOK_CURRENT.host = HOOK_CURRENT.render = HOOK_CURRENT.hook = 0;
		return resolve;
	}
	function use(reducer, state) {
		let index = HOOK_CURRENT.index++;
		let mount;
		if (!hooks[index]) {
			hooks[index] = [reducer, state];
			mount = 1;
		}
		update(hooks[index], mount ? HOOK_MOUNT : HOOK_UPDATE);
		return hooks[index];
	}
	function clean() {
		updateAll(hooks, HOOK_UNMOUNTED);
	}
	return hook;
}

export function useState(initialState) {
	let render = useRender();
	return useHook((state, type) => {
		if (HOOK_MOUNT == type) {
			state[0] = isFunction(initialState) ? initialState() : initialState;
			state[1] = nextState => {
				state[0] = isFunction(nextState)
					? nextState(state[0])
					: nextState;
				render();
			};
		}
		return state;
	}, []);
}

export function useEffect(callback, args) {
	useHook(
		(state, type) => {
			switch (type) {
				case HOOK_UPDATE:
				case HOOK_UNMOUNTED:
					if (state[1]) {
						let next =
							type == HOOK_UNMOUNTED ||
							(args && state[0]
								? !isEqualArray(args, state[0])
								: true);
						if (next) {
							state[1].then(handler => handler && handler());
							state[1] = 0;
						}
					}
					break;
				case HOOK_MOUNTED:
				case HOOK_UPDATED:
					let next =
						type == HOOK_MOUNTED ||
						(args && state[0]
							? !isEqualArray(args, state[0])
							: true);
					if (next) {
						state[1] = defer(callback);
					}
					break;
			}
			return state;
		},
		[args]
	);
}

export function useRef(current) {
	return useHook(0, { current });
}

export function useMemo(callback, args = ARRAY_EMPTY) {
	let state = useHook(0, []);

	if (!state[0] || (state[0] && !isEqualArray(state[0], args))) {
		state[1] = callback();
	}
	state[0] = args;
	return state[1];
}

export function useReducer(reducer, initialState) {
	let render = useRender();
	let hook = useHook((state, type) => {
		if (HOOK_MOUNT == type) {
			state[0] = initialState;
			state[1] = action => {
				state[0] = state[2](state[0], action);
				render();
			};
		}
		return state;
	}, []);

	hook[2] = reducer;

	return hook[1];
}
