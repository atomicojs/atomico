import { diff } from "./diff";
import { toVnode, createElement } from "./vnode";
import { STATE, NODE_HOST, OBJECT_EMPTY } from "./constants";

export function render(vnode, parent, ID) {
	ID = ID || STATE;

	vnode = toVnode(vnode);
	if (ID == STATE && vnode.type != NODE_HOST) {
		vnode = createElement(NODE_HOST, {}, vnode);
	}
	diff(ID, parent, vnode, OBJECT_EMPTY);
}
