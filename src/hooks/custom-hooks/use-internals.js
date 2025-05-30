import { SymbolFor } from "../../utils.js";
import { useWhen, useHost, useHook, useRef } from "../create-hooks.js";
import { useState, useEffect } from "../hooks.js";
import { useListener } from "./use-listener.js";
import { useProp } from "./use-prop.js";

export const FORM_ASSOCIATED = "formAssociated";
export const FORM_DISABLED = "formDisabled";
export const FORM_RESET = "formReset";

const ID = SymbolFor("hook/internals");

const setInternalFormValue = (internals, prop, value) => {
    const form = new FormData();
    const type = typeof value;
    /**
     * @type {any}
     */
    const nextValue =
        type == "number" || type == "boolean" ? value + "" : value;

    if (value) form.append(prop, nextValue);

    internals.setFormValue(form, form);

    return form.get(prop);
};

/**
 *
 * @param {string} method
 * @returns {(callback:(...any:any[])=>any)=>void}
 */
const createFormMethod = (method) => (callback) =>
    useWhen(method, (arg) => callback(arg));

/**
 * @type {import("hooks").UseInternals}
 */
export const useInternals = () => {
    const { current } = useHost();

    current[ID] = current[ID] || current.attachInternals();

    return current[ID];
};

/**
 * @type {import("hooks").UseFormProps}
 */
export const useFormProps = (propName = "name", propValue = "value") => {
    const internals = useInternals();
    const [name] = useProp(propName);
    const [value, setValue] = useProp(propValue);

    useFormReset(() => setValue(null));

    useEffect(() => {
        setInternalFormValue(internals, name, value);
    }, [name, value]);

    return [value, setValue];
};

/**
 * @type {import("hooks").UseFormValidity}
 */
export const useFormValidity = (callback, args) => {
    const [, setStaste] = useState("");
    const [state] = useState(() => ({ args, report: false }));

    const internals = useInternals();

    const handler = () => {
        if (!state.report) {
            state.report = !args.every((value, i) => value === state.args[i]);
        }
        if (!state.report) return;

        /**
         * @type {any}
         */
        const validity = {};

        const { message, report = state.report, ...config } = callback();

        config.customError = config.customError ?? !!message;

        let id = `${message}`;

        for (const prop in internals.validity) {
            validity[prop] = config?.[prop] ?? false;
            id += `${prop}:${validity[prop]}`;
        }

        internals.setValidity(validity, message);

        if (message && report) (internals.form || internals).reportValidity();

        validity.message = internals.validationMessage;

        setStaste(id);
    };

    useFormSubmit((event) => {
        state.report = true;
        handler();
        if (!internals.validity.valid) event.preventDefault();
    });

    useEffect(handler, args);

    return [internals.validationMessage, internals.validity];
};

/**
 * @type {import("hooks").UseFormValue}
 */
export const useFormValue = (prop) => {
    const internals = useInternals();
    const [value, setValue] = useState();

    return [
        value,
        useHook(
            (
                /**
                 * @type {(state: string | boolean | number) => void}
                 */
                callback = (value) => {
                    setValue(setInternalFormValue(internals, prop, value));
                }
            ) => callback
        )
    ];
};

/**
 * @type {import("hooks").UseFormSubmit}
 */
export const useFormSubmit = (callback, options) => {
    const internals = useInternals();
    const refForm = useRef(internals.form);
    useListener(refForm, "submit", callback, options);
};

/**
 * @type {import("hooks").UseFormAssociated}
 */
export const useFormAssociated = createFormMethod(FORM_ASSOCIATED);
/**
 * @type {import("hooks").UseFormDisabled}
 */
export const useFormDisabled = createFormMethod(FORM_DISABLED);
/**
 * @type {import("hooks").UseFormReset}
 */
export const useFormReset = createFormMethod(FORM_RESET);
