import { describe, it, expect, vi } from "vitest";
import { createHooks } from "../create-hooks.js";
import { useRender } from "../custom-hooks/use-render.js";
import { INSERTION_EFFECT } from "../use-effect.js";

describe("src/hooks/custom-hooks/use-event", () => {
    it("association of useEvent to host", () => {
        const host = document.createElement("div");
        const hooks = createHooks(() => {}, host);

        hooks.render(() => {
            useRender(() => <h1>title</h1>);
        });

        hooks.dispatch(INSERTION_EFFECT);

        expect(host.innerHTML).toEqual(`<h1>title</h1>`);
    });
    it("association of useEvent to host", () => {
        const host = document.createElement("div");
        const hooks = createHooks(() => {}, host);

        hooks.render(() => {
            useRender(() => (
                <host>
                    <h1>title</h1>
                </host>
            ));
        });

        hooks.dispatch(INSERTION_EFFECT);

        expect(host.innerHTML).toEqual(`<h1>title</h1>`);
    });
    it("association of useEvent to host", () => {
        const host = document.createElement("div");
        const hooks = createHooks(() => {}, host);
        const spyFn = vi.fn(() => <h1>title</h1>);

        const load = (value) => {
            hooks.render(() => {
                useRender(spyFn, [value]);
            });
        };

        load(0);
        hooks.dispatch(INSERTION_EFFECT);
        load(0);
        hooks.dispatch(INSERTION_EFFECT);
        load(0);
        hooks.dispatch(INSERTION_EFFECT);
        load(1);
        hooks.dispatch(INSERTION_EFFECT);
        load(2);
        hooks.dispatch(INSERTION_EFFECT);

        expect(host.innerHTML).toEqual(`<h1>title</h1>`);

        expect(spyFn).toHaveBeenCalledTimes(3);
    });
});
