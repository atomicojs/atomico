/**
 *
 * @type {import("./types/utils").ClassName}
 */
export const className = (...args) => args.filter((value) => value).join(" ");
/**
 *
 * @type {import("./types/utils.js").DelegateValidity}
 */
export const delegateValidity = ({ validity, validationMessage: message }) => {
    const next = { message };
    for (const prop in validity) next[prop] = validity[prop];
    return next;
};
