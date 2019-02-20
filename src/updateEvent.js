import { options } from "./options";
import { EVENT_ALIAS } from "./constants";

export function updateEvent(node, type, prevHandler, nextHandler, handlers) {
    if (type[0] !== "o" && type[1] !== "n") return;

    if (!EVENT_ALIAS[type])
        EVENT_ALIAS[type] = type.slice(2).toLocaleLowerCase();

    type = EVENT_ALIAS[type];
    if (!handlers[type]) {
        handlers[type] = [event => handlers[type][1].call(event.target, event)];
    }
    let eventProxy = handlers[type][0];
    if (prevHandler && !nextHandler) {
        node.removeEventListener(type, eventProxy);
        delete handlers[type];
    } else {
        if (!prevHandler && nextHandler) {
            node.addEventListener(type, eventProxy);
        }
        handlers[type][1] = nextHandler;
    }
}
