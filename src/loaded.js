import { addListener } from "./utils.js";

export const DOMLoaded = new Promise((resolve) => {
    if (document.readyState === "loading") {
        addListener(document, "DOMContentLoaded", resolve);
    } else {
        resolve();
    }
});
