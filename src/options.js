export let options = {
    /**
     * CSSStyleSheet support
     * @type {boolean}
     */
    //@ts-ignore
    sheet: !!document.adoptedStyleSheets,
    /**
     * modify the render of the virtual-dom
     */
    render: null,
};
