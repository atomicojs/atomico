/**
 * @type {Options}
 */
export let options = {
    //@ts-ignore
    sheet: !!document.adoptedStyleSheets,
};

/**
 * @typedef {Object} Options
 * @property {boolean} sheet
 * @property {(target:ChildNode, id:string|symbol, hydrate?:boolean)=>ChildNode} [render]
 * @property {boolean} [ssr]
 */
