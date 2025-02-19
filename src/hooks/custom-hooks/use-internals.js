import { SymbolFor } from "../../utils.js";
import { useWhen, useHost } from "../create-hooks.js";

export const FORM_ASSOCIATED = "formAssociated";
export const FORM_DISABLED = "formDisabled";
export const FORM_RESET = "formReset";
export const FORM_RESTORE = "formStateRestore";

const ID = SymbolFor("hook/internals");

export const useInternals = () => {
    const { current } = useHost();

    current[ID] = current[ID] || current.attachInternals();

    return current[ID];
};

export const useFormValue = () => {};

/**
 *
 * @param {string} method
 * @returns {(callback:(...any:any[])=>any)=>void}
 */
const createFormMethod = (method) => (callback) =>
    useWhen(method, (args) => callback(...args));

export const useFormAssociated = createFormMethod(FORM_ASSOCIATED);
export const useFormDisabled = createFormMethod(FORM_DISABLED);
export const useFormReset = createFormMethod(FORM_RESET);
export const useformStateRestore = createFormMethod(FORM_RESTORE);
