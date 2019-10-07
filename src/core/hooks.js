import {
	HOOK_MOUNT,
	HOOK_UPDATE,
	HOOK_CURRENT,
	HOOK_MOUNTED,
	HOOK_UPDATED,
	HOOK_UNMOUNT,
	ARRAY_EMPTY
} from "./constants";
import { isFunction, isEqualArray } from "./utils";

function update(hook, type) {
	hook[0] && (hook[1] = hook[0](hook[1], type));
}

function updateAll(hooks, type) {
	for (let i in hooks) update(hooks[i], type);
}

export function useHook(reducer, initialState) {
	if (HOOK_CURRENT.ref.hook) {
		return HOOK_CURRENT.ref.hook.use(reducer, initialState)[1];
	}
}

export function useRender() {
	return HOOK_CURRENT.ref.render;
}

export function useHost() {
	return useHook(0, { current: HOOK_CURRENT.ref.host });
}

export function createHookCollection(render, host) {
	let hooks = {};
	let mounted;
	let hook = {
		use,
		load,
		updated,
		unmount
	};

	let ref = { hook, host, render };

	function load(callback, param) {
		HOOK_CURRENT.index = 0;
		HOOK_CURRENT.ref = ref;
		let resolve = callback(param);
		HOOK_CURRENT.ref = 0;
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
	function updated() {
		updateAll(hooks, mounted ? HOOK_UPDATED : HOOK_MOUNTED);
		mounted = 1;
	}
	function unmount() {
		updateAll(hooks, HOOK_UNMOUNT);
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
				case HOOK_UNMOUNT:
					if (state[1]) {
						let next =
							type == HOOK_UNMOUNT ||
							(args && state[0]
								? !isEqualArray(args, state[0])
								: true);
						if (next) {
							state[1]();
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
						state[1] = callback();
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
