import { ELEMENT_TRUE_VALUES } from "../constants";

export function setAttr(node, attr, value) {
    if (value == null) {
        node.removeAttribute(attr);
    } else {
        node.setAttribute(
            attr,
            typeof value == "object" ? JSON.stringify(value) : value
        );
    }
}

export function formatType(value, type = String) {
    try {
        if (type == Boolean) {
            value = ELEMENT_TRUE_VALUES.indexOf(value) > -1;
        } else if (typeof value == "string") {
            value =
                type == Number
                    ? Number(value)
                    : type == Object || type == Array
                    ? JSON.parse(value)
                    : type == Date
                    ? new Date(value)
                    : value;
        }
        if ({}.toString.call(value) == `[object ${type.name}]`) {
            return { value, error: type == Number && Number.isNaN(value) };
        }
    } catch (e) {}

    return { value, error: true };
}

export function propToAttr(prop) {
    return prop.replace(/([A-Z])/g, "-$1").toLowerCase();
}

export function attrToProp(attr) {
    return attr.replace(/-(\w)/g, (all, letter) => letter.toUpperCase());
}

export function dispatchEvent(node, type, customEventInit) {
    node.dispatchEvent(
        new CustomEvent(
            type,
            typeof customEventInit == "object" ? customEventInit : null
        )
    );
}
