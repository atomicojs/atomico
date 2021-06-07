/**
 * Create a div that fills with the virtual-dom and
 * then inject it into the document, fixture is
 * persistent between tests so each execution
 * within the test recycles the host,
 * allowing to evaluate the update cycles correctly
 *
 * @example
 * ```js
 * import { html } from "atomico";
 * import { fixture } from "atomico/test-dom";
 * import { expect } from "@esm-bundle/chai";
 *
 * describe("test DOM", ()=>{
 *      it("example",()=>{
 *          const img = fixture(html`<img src="./image"/>`);
 *          expect(img.src).to.equal("./image");
 *      })
 * })
 * ```
 */
export function fixture<E = Element>(vdom: any): E;
