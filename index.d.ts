type VnodeType = string | null | Component;

type Host = HTMLElement | SVGElement;

interface Options {
	document?: object;
}

interface Props {
	[index: string]: any;
}

interface Component {
	(props: Props): Vnode;
}

interface Vnode {
	type: VnodeType;
	props: Props;
}

interface SetState {
	(nextState: any): void;
}

interface Ref {
	current: any;
}

interface Action {
	type: any;
}

interface Dispatch {
	(action: Action);
}

interface MapChildren {
	(child: any, index: number): Vnode;
}

interface OptionsRender {
	id?: string | Symbol;
	bind?: Object | Host;
	host?: boolean;
}

interface CallbackReducer {
	(state: any, action: Action): any;
}

declare module "@atomico/core" {
	export let options: Options;
	export function h(type: VnodeType, props: Props, ...children: any[]): Vnode;
	export function toList(children: any, mapChildren?: MapChildren): Vnode[];
	export function render(
		vnode: Vnode,
		node: Host,
		options?: OptionsRender
	): void;
	export function useState(initialState: any): [any, SetState];
	export function useEffect(callbackEffect: Function): void;
	export function useMemo(callbackMemo: Function): any;
	export function useReducer(
		callbackReducer: CallbackReducer,
		initialState: any
	): [any, Dispatch];
	export function useRef(current: any): { current: any };
	export function useHost(): Host;
}
