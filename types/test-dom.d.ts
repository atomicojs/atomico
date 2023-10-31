import { DOMEvent, DOMThis } from "./dom.js";
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
export function fixture<E = Element>(vnode: any): DOMThis<E>;

/**
 * Allows to listen to an event asynchronously,
 * the promise will be returned once the event is dispatched
 * @example
 * ```js
 * import { asyncEventListener } from "atomico/test-dom";
 * import { expect } from "@esm-bundle/chai";
 *
 * describe("asyncEventListener", ()=>{
 *      it("example",async ()=>{
 *          let eventExpect;
 *          setTimeout(() => {
 *              window.dispatchEvent((eventExpect = new Event("click")));
 *          });
 *
 *          const event = await asyncEventListener(window, "click");
 *
 *          expect(eventExpect).to.equal(event);
 *      })
 * })
 * ```
 */
export function asyncEventListener<Base extends ChildNode | typeof window>(
    base: Base,
    type: string
): Promise<DOMEvent<Base>>;

export type DispatchEvent = (
    currentTarget: Node,
    event: Event,
    target?: any
) => boolean;

export const dispatchEvent: DispatchEvent;
