
interface FunctionalWebComponent {
	(props: Object): any;
	props: {
		[index: string]: Number | String  | Object | Boolean | {
			type : Number | String | Object | Boolean
		};
	};
	catch?:Function
}





declare module "atomico" {
	export function customElement(
		tagName: string,
		component: FunctionalWebComponent
	): Function;
	export function h(nodeType:string|null|Function,props?:Object,...children:any[]):Object
	export function useState(initialState: any): [any, Function];
	export function useEffect(callbackEffect: Function,vars:any[]): void;
	export function useMemo(callbackMemo: Function): any;
	export function useReducer(
		callback:Function,
		initialState: any
	): [any, Function];
	export function useRef(current: any): { current: any };
	export function useProp(observable: string): Function;
	export function useEvent(
		type: string,
		customEventInit?: {
				detail?: any;
				bubbles?: Boolean;
				cancelable?: Boolean;
				composed?: Boolean;
		}
	): Function;
}

declare module "atomico/lazy" {
	export function useLazy(callback: Function): Function;
}

declare module "atomico/router" {
	export function useRedirect(path?: string): Function;
	export function useRouter(router:{
		[index:string]:Function
	}):Function;
	export function useRoute(path:string) : [boolean,Object];
}


declare module "atomico/html" {
	export default function html(template: string, ...values: any[]): Object;
}


declare module "atomico/use-state-generator"{
	export function delay(ms:number):Promise<any>;
	export function useStateGenerator(callback:Function,initialState:any,vars:any[]):[any,Promise<any>]
}