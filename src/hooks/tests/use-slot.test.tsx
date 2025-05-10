import { describe, it, expect, vi } from "vitest";
import { createHooks } from "../create-hooks.js";
import { useSlot } from "../custom-hooks/use-slot.js";
import { EFFECT, INSERTION_EFFECT, LAYOUT_EFFECT } from "../use-effect.js";

describe("src/hooks/custom-hooks/use-event", () => {
    it("association of useEvent to host", async () => {
        const host = document.createElement("div");
        const slot = document.createElement("slot");
        const refSlot = { current: slot };

        host.attachShadow({ mode: "open" });
        host.shadowRoot.append(slot);

        const content = document.createElement("h1");
        host.append(content);

        document.body.append(host);

        const hooks = createHooks(load, host);

        const spyFn = vi.fn();

        function load() {
            hooks.render(() => {
                spyFn(useSlot(refSlot));
            });
            hooks.dispatch(INSERTION_EFFECT);
            hooks.dispatch(LAYOUT_EFFECT);
            hooks.dispatch(EFFECT);
        }

        load();

        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(spyFn.mock.calls).toEqual([[[]], [[content]]]);
    });
    it("association of useEvent to host", async () => {
        const host = document.createElement("div");
        const slot = document.createElement("slot");
        const refSlot = { current: slot };

        host.attachShadow({ mode: "open" });
        host.shadowRoot.append(slot);

        const content = document.createElement("h1");
        host.append(content);

        document.body.append(host);

        const hooks = createHooks(load, host);

        const spyFn = vi.fn();

        function load() {
            hooks.render(() => {
                useSlot(refSlot, spyFn);
            });
            hooks.dispatch(INSERTION_EFFECT);
            hooks.dispatch(LAYOUT_EFFECT);
            hooks.dispatch(EFFECT);
        }

        load();

        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(spyFn.mock.calls).toEqual([[content]]);
    });
});
