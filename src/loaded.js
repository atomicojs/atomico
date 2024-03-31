import { options } from "./options.js";
import { addListener } from "./utils.js";

export const DOMLoaded = new Promise((resolve) => {
    if (!options.ssr) addListener(globalThis, "DOMContentLoaded", resolve);
});
