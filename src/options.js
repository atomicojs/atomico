import { SymbolFor } from "./utils.js";

const ID = SymbolFor("atomico/options");

globalThis[ID] = globalThis[ID] || {
    sheet: !!document.adoptedStyleSheets
};

/**
 * @type {import("core").Options}
 */
export const options = globalThis[ID];
