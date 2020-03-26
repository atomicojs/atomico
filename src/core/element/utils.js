export const TRUE_VALUES = [true, 1, "", "1", "true"];

export const Any = null;

export function formatType(value, type) {
    if (type == Any) return { value };

    try {
        if (type == Boolean) {
            value = TRUE_VALUES.includes(value);
        } else if (typeof value == "string") {
            value =
                type == Number
                    ? Number(value)
                    : type == Object || type == Array
                    ? JSON.parse(value)
                    : value;
        }
        if ({}.toString.call(value) == `[object ${type.name}]`) {
            return { value, error: type == Number && Number.isNaN(value) };
        }
    } catch (e) {}

    return { value, error: true };
}

export const setAttr = (node, attr, value) =>
    value == null
        ? node.removeAttribute(attr)
        : node.setAttribute(
              attr,
              typeof value == "object" ? JSON.stringify(value) : value
          );

export const propToAttr = prop => prop.replace(/([A-Z])/g, "-$1").toLowerCase();

export const attrToProp = attr =>
    attr.replace(/-(\w)/g, (all, letter) => letter.toUpperCase());

export const dispatchEvent = (node, type, customEventInit) =>
    node.dispatchEvent(
        new CustomEvent(
            type,
            typeof customEventInit == "object" ? customEventInit : null
        )
    );

export const createPropError = (status, message) =>
    Object.assign(new Error("Failed prop\n" + message), status);
