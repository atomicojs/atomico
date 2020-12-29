export const SupportAdopted = document.adoptedStyleSheets;
/**
 * create a safe string
 * @param {TemplateStringsArray} template
 * @param {any[]} args
 */
export const saniate = (template, args) =>
    template.reduce(
        (current, value, index) => current + value + saniateValue(args[index]),
        ""
    );

/**
 * avoid concatenating values other than string or number
 * @param {*} value
 */
export const saniateValue = (value) => {
    const type = typeof value;
    return type == "string" || type == "number" ? value : "";
};
/**
 * Create a stylesheet according to browser support
 * @param {string} cssText
 * @returns {Sheet}
 */
export const createSheet = (cssText) => {
    if (SupportAdopted) {
        const sheet = new CSSStyleSheet();
        sheet.replace(cssText);
        return sheet;
    } else {
        const sheet = document.createElement("style");
        sheet.textContent = cssText;
        return sheet;
    }
};
