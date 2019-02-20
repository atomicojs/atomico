/**
 * memorizes the transformations associated with the css properties.
 * @example
 * {borderRadius:"50px"} // {"border-radius" : "50px"}
 */
const CSS_PROPS = {};

/**
 * Define the style property immutably
 * @param {HTMLElement|SVGAElement} node
 * @param {object|string} nextValue
 */
export function updateStyle(node, prevValue, nextValue) {
    // this function has the previous state of the css directly from the node by the constant [CSS_VALUE]
    let prevCss = prevValue,
        nextCss = nextValue;
    if (typeof nextValue === "object") {
        nextCss = "";
        for (let key in nextValue) {
            if (!nextValue[key]) continue;
            if (!CSS_PROPS[key]) {
                CSS_PROPS[key] = key.replace(
                    /([^A-Z])([A-Z])/g,
                    (all, letterBefore, letterAfter) =>
                        letterBefore + "-" + letterAfter.toLowerCase()
                );
            }
            nextCss += `${CSS_PROPS[key]}:${nextValue[key]};`;
        }
    }

    if (prevCss !== nextCss) {
        node.style.cssText = nextCss;
    }

    return nextCss;
}
