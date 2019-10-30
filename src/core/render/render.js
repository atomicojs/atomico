import { diff } from "./diff";
import { toVnode, createElement } from "../vnode";
import { NODE_HOST } from "../constants";

export function render(vnode, node, id = "vnode") {
	vnode = toVnode(vnode);
	if (vnode.$type != NODE_HOST) {
		vnode = createElement(NODE_HOST, { children: vnode });
	}
	diff(id, node, vnode);
	return node;
}
