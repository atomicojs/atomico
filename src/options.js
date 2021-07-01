export const options = {
    /**
     * CSSStyleSheet support
     * @type {boolean}
     */
    //@ts-ignore
    sheet: !!document.adoptedStyleSheets,
    /**
     * define if you use rendering from the server
     * @type {(component:import("./element/custom-element").Context)=>void}
     */
    ssr: null,
};
