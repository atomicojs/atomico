//@ts-ignore
import { expect } from "@esm-bundle/chai";
import { createHooks } from "../create-hooks";
import { useEvent } from "../custom-hooks/use-event";

describe("src/hooks/custom-hooks/use-event", () => {
    it("association of useEvent to host", (done) => {
        let render = () => {};
        let el = document.createElement("div");
        let hooks = createHooks(render, el);
        let typeEvent = "anyEvent";
        el.addEventListener(typeEvent, () => {
            done();
        });

        let load = () => {
            let dispatchEvent = useEvent(typeEvent);
            dispatchEvent();
        };

        hooks.load(load, null);
    });
    it("association of useEvent to host with configuration", (done) => {
        let render = () => {};
        let el = document.createElement("div");
        let container = document.createElement("div");
        let hooks = createHooks(render, el);
        let eventInit = {
            bubbles: true,
            detail: "any!",
        };
        let typeEvent = "anyEvent";
        //@ts-ignore
        container.addEventListener(typeEvent, ({ detail }) => {
            expect(detail).to.equal(eventInit.detail);
            done();
        });

        container.appendChild(el);

        let load = () => {
            let dispatchEvent = useEvent(typeEvent, eventInit);
            dispatchEvent();
        };

        hooks.load(load, null);
    });
    it("false param", (done) => {
        let render = () => {};
        let el = document.createElement("div");
        let hooks = createHooks(render, el);
        let typeEvent = "anyEvent";
        let param = false;
        el.addEventListener(
            typeEvent,
            /**
             * @param {CustomEvent} event
             */
            (event) => {
                expect(event.detail).to.equal(param);
                done();
            }
        );

        let load = () => {
            let dispatchEvent = useEvent(typeEvent);
            dispatchEvent(param);
        };

        hooks.load(load, null);
    });
    it("fill detail param", (done) => {
        let render = () => {};
        let el = document.createElement("div");
        let hooks = createHooks(render, el);
        let typeEvent = "anyEvent";
        let param = false;
        el.addEventListener(
            typeEvent,
            /**
             * @param {CustomEvent} event
             */
            (event) => {
                expect(event.detail).to.equal(param);
                done();
            }
        );

        let load = () => {
            let dispatchEvent = useEvent(typeEvent, {
                detail: param,
            });
            dispatchEvent();
        };

        hooks.load(load, null);
    });
});
