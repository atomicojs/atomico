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

interface WebComponent {
	(props: Props): Vnode;
	observables: {
		[index: string]: Number | String | Promise | Array | Object | Boolean;
	};
	styles: Object[];
}

interface UseRoute {
	(path?: string): [boolean, Object];
}

interface CustomEventInit {
	detail?: any;
	bubbles?: Boolean;
	cancelable?: Boolean;
	composed?: Boolean;
}

declare module "atomico" {
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
	export function customElement(
		tagName: string,
		component: WebComponent
	): Vnode;
	export function useProp(observable: string): Function;
	export function useEvent(
		type: string,
		customEventInit?: CustomEventInit
	): Function;
}

declare module "atomico/lazy" {
	export function lazy(callback: Function): Promise;
}

declare module "atomico/router" {
	export function Router(): Vnode;
	export function useRedirect(path?: string): Function;
	export function useHistory(): [string, Function];
	export const useMatchRoute: UseRoute;
	export const useRouter: UseRoute;
}
