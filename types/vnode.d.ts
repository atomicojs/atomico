import { ObjectFill } from "./schema";

export type VNodeChildren<Children> = Children extends null
    ? any[]
    : Children extends any[]
    ? Children
    : Children[];

export type VNodeProps<Props> = Props extends null
    ? ObjectFill
    : ObjectFill & Props;

export type VnodeKeyTypesRaw = Node | typeof Element | Element | typeof Node;

export type VNodeKeyTypes = string | VnodeKeyTypesRaw | null;

export type VNodeType<Type> = Type;

export type VNode<Type, Props = null, Children = null> = {
    $$: symbol;
    type: VNodeType<Type>;
    props: VNodeProps<Props>;
    children: VNodeChildren<Children>;
    key?: any;
    shadow?: boolean;
    static?: boolean;
    raw?: number;
    is?: string;
    clone?: boolean;
    meta?: any;
};
