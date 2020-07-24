interface Host extends HTMLElement {
    class: string;
    shadowDom: boolean;
    children: any;
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

declare module "atomico" {
    namespace JSX {
        interface IntrinsicElements {
            host: Partial<Host> & { style: string | Object };
        }
    }
}
