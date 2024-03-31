import { options } from "./options.js";
import { addListener } from "./utils.js";

export const DOMLoaded = new Promise((resolve) => {
    if (!options.ssr) {
        if (document.readyState === "loading") {
            addListener(document, "DOMContentLoaded", resolve);
        } else {
            resolve();
        }
    }
});
