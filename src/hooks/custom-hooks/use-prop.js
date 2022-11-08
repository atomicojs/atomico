import { useHost } from "../create-hooks.js";

/**
 *
 * @type {import("core").UseProp}
 */
export let useProp = (name) => {
    let ref = useHost();
    if (name in ref.current) {
        if (!ref[name]) {
            /**
             * @type {import("core").ReturnUseProp<any>}
             */
            let updater = [
                null,
                (nextValue) => (ref.current[name] = nextValue),
            ];
            ref[name] = updater;
        }
        ref[name][0] = ref.current[name];

        return ref[name];
    }
};
