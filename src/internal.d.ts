interface Host extends HTMLElement {
    class: string;
    shadowDom: boolean;
    children?: any;
    style: string | Object;
    [custom: string]: any;
}

type VdomTypes = typeof Node | string;

interface Vdom<T, P> {
    type: T;
    props: P;
    children: any[];
    readonly key?: any;
    readonly shadow?: boolean;
    readonly raw?: boolean;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            host: Partial<Host>;
        }
    }
}

export interface flatParamMap<T> extends Array<any> {
    _?: Map<any, any>;
}

export type h = <T, P>(type: T, props: P) => Vdom<T, P>;
