import { FillObject } from "./schema.js";
import { JSXProps, Nullable } from "./dom.js";

export type VNodeChildren<Children> = Children extends null
    ? any[]
    : Children extends any[]
      ? Children
      : Children[];

export type VNodeProps<Props> = Props extends null
    ? FillObject
    : FillObject & Props;

export type VnodeKeyTypesRaw = Node | typeof Element | Element | typeof Node;

export type VNodeKeyTypes = string | VnodeKeyTypesRaw | null;

export type VNodeType<Type> = Type;

export type VNodeRender = <T = Element>() => (
    node: T,
    id?: symbol | string,
    hydrate?: boolean
) => T;

export type H = <Type, Props, Childre>(
    type: Type,
    props?: Props,
    ...children: Childre[]
) => VNode<Type, Props, Childre>;

interface VNodeGenericSchema {
    [TYPE: symbol]: symbol;
    key?: any;
    shadow?: boolean | Partial<ShadowRootInit>;
    static?: boolean;
    is?: string;
    clone?: boolean;
    render: VNodeRender;
}

interface VNodeSchema<Type, Props, Children, Raw extends number>
    extends VNodeGenericSchema {
    type: Type;
    props: Nullable<Props>;
    children: Children;
    raw: Raw;
}

export type VNode<Type, Props = any, Children = any> = Type extends string
    ? VNodeSchema<string, JSXProps<Type>, Children, 0>
    : Type extends HTMLElement
      ? VNodeSchema<InternalElement, Props, Children, 1>
      : Type extends typeof HTMLElement
        ? VNodeSchema<CustomElementConstructor, Props, Children, 2>
        : VNodeSchema<any, Props, Children, number>;

export type VNodeAny = VNode<any>;

export type VNodeGeneric =
    | VNode<string>
    | VNode<Element>
    | VNode<typeof HTMLElement>;

export interface VNodeListener extends AddEventListenerOptions {
    (event: Event | CustomEvent): any;
}

export type VNodeStore = {
    vnode: any;
    cycle: number;
    fragment?: Fragment;
    handlers: any;
};

export type RenderId = symbol | string;

export type Keyes = Map<any, ChildNode>;

export interface Handlers extends EventListenerObject {
    [event: string]: VNodeListener;
}

export type Fragment = {
    markStart: ChildNode;
    markEnd: ChildNode;
    keyes?: Keyes;
};

export type Render = <T extends Element>(
    vnode: VNodeAny,
    node: T,
    id?: RenderId
) => T;

interface InternalElement extends Element {
    cloneNode(value: boolean): Element;
}
