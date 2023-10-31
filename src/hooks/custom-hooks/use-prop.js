import { useHost } from "../create-hooks.js";

/**
 * @type {import("core").UseProp}
 */
export const useProp = (name) => {
    const ref = useHost();
    if (name in ref.current) {
        if (!ref[name]) {
            /**
             * @type {import("core").ReturnUseProp<any>}
             */
            const updater = [
                null,
                (nextValue) => (ref.current[name] = nextValue),
            ];
            ref[name] = updater;
        }
        ref[name][0] = ref.current[name];

        return ref[name];
    }
};
