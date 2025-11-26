import { describe, expect, it, vi } from "vitest";
import { createHooks } from "../create-hooks.js";
import { useEvent } from "../custom-hooks/use-event.js";

describe("src/hooks/custom-hooks/use-event", () => {
    it("association of useEvent to host", () => {
        let render = () => {};
        let el = document.createElement("div");
        let hooks = createHooks(render, el);
        let typeEvent = "anyEvent";
        const done = vi.fn();

        el.addEventListener(typeEvent, () => {
            done();
        });

        let load = () => {
            let dispatchEvent = useEvent(typeEvent);
            dispatchEvent();
        };

        hooks.render(load);

        expect(done).toBeCalledTimes(1);
    });
    it("base property", () => {
        let el = document.createElement("div");
        let hooks = createHooks(null, el);
        let typeEvent = "anyEvent";
        const done = vi.fn();
        class MyEvent extends Event {}

        el.addEventListener(typeEvent, (event) => {
            expect(event).instanceOf(MyEvent);
            done();
        });

        let load = () => {
            let dispatchEvent = useEvent(typeEvent, { base: MyEvent });
            dispatchEvent();
        };

        hooks.render(load);

        expect(done).toBeCalledTimes(1);
    });
    it("association of useEvent to host with configuration", () => {
        let el = document.createElement("div");
        let container = document.createElement("div");
        let hooks = createHooks(null, el);
        let eventInit = {
            bubbles: true,
            detail: "any!"
        };
        let typeEvent = "anyEvent";
        const done = vi.fn();
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

        hooks.render(load);

        expect(done).toBeCalledTimes(1);
    });
    it("false param", () => {
        let el = document.createElement("div");
        let hooks = createHooks(null, el);
        let typeEvent = "anyEvent";
        let param = false;
        const done = vi.fn();
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

        hooks.render(load);

        expect(done).toBeCalledTimes(1);
    });
    it("fill detail param", () => {
        let el = document.createElement("div");
        let hooks = createHooks(null, el);
        let typeEvent = "anyEvent";
        let param = false;
        const done = vi.fn();
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
                detail: param
            });
            dispatchEvent();
        };

        hooks.render(load);

        expect(done).toBeCalledTimes(1);
    });
});
