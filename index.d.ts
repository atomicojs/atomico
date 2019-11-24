type CurrentState = any;

type NodeType = string | null | Function;

type Action = { [index: string]: any; type?: any };

type Ref = { [index: string]: any };

type Dispatch = (action: Action) => null;

type Reducer = (state: any, action: Action) => any;

export type Types = Number | String | Boolean | Object;

export type SchemaTypes = {
    type: Types;
    value: any;
    reflect?: boolean;
    event:
        | boolean
        | {
              type?: string;
              bubbles?: boolean;
              detail?: any;
              cancelable?: Boolean;
          };
};

export interface Component {
    (props: Object): any;
    props: {
        [index: string]: Types | SchemaTypes;
    };
    error?: Function;
}

declare module "atomico" {
    export function customElement(
        tagName: string | Component,
        component?: Component
    ): Function | HTMLElement;
    export function h(
        nodeType: NodeType,
        props?: Object,
        ...children: any[]
    ): Object;
    export function useState(initialState: any): [CurrentState, Function];
    export function useEffect(callbackEffect: Function, vars?: any[]): void;
    export function useMemo(callbackMemo: Function): any;
    export function useReducer(
        callback: Reducer,
        initialState?: any
    ): [CurrentState, Dispatch];
    export function useRef(current?: any): Ref;
    export function useProp(observable: string): [CurrentState, Function];
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
    export function useRouter(router: { [index: string]: Function }): Function;
    export function useRoute(path: string): [boolean, Object];
}

declare module "atomico/html" {
    export default function html(template: string, ...values: any[]): Object;
}

declare module "atomico/use-state-generator" {
    export function delay(ms: number): Promise<any>;
    export function useStateGenerator(
        callback: Function,
        initialState: any,
        vars: any[]
    ): [any, Promise<any>];
}
