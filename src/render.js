import { diff } from "./diff";
import { toVnode, createElement } from "./vnode";
import { STATE, NODE_HOST } from "./constants";

export function render(vnode, parent, ID) {
    ID = ID || STATE;
    vnode = toVnode(vnode);
    if (vnode.type != null && vnode.type != NODE_HOST) {
        vnode = createElement(NODE_HOST, {}, vnode);
    }
    diff(ID, parent, vnode);
}
