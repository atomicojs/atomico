import { describe, it, expect, vi } from "vitest";
import { createHooks } from "../create-hooks.js";
import { useNodes } from "../custom-hooks/use-nodes.js";
import { EFFECT, INSERTION_EFFECT, LAYOUT_EFFECT } from "../use-effect.js";
import { Mark } from "../../render.js";
import { delay } from "./utils.js";

describe("src/hooks/custom-hooks/use-nodes", () => {
    it("useNodes - lifecycle by insertion, deletion, and text", async () => {
        const host = document.createElement("div");
        host.attachShadow({ mode: "open" });

        const node1 = document.createElement("h1");
        const node2 = document.createElement("h1");
        const text1 = new Text("h1");
        const text2 = new Mark();

        host.append(node1);

        document.body.append(host);

        const hooks = createHooks(load, host);

        const spyFn = vi.fn();

        function load() {
            hooks.render(() => {
                spyFn(useNodes());
            });
            hooks.dispatch(INSERTION_EFFECT);
            hooks.dispatch(LAYOUT_EFFECT);
            hooks.dispatch(EFFECT);
        }

        load();
        await delay();

        //TEST: Verify that the spy receives node1 as an argument after the first render.
        expect(spyFn.mock.calls).toEqual([[[]], [[node1]]]);

        host.append(node2);
        await delay();

        //TEST: Verify that the spy receives node1 and node2 as arguments after rendering.
        expect(spyFn.mock.calls).toEqual([[[]], [[node1]], [[node1, node2]]]);

        node1.remove();
        await delay();

        //TEST: Verify that the spy knows about data updates due to deletion.
        expect(spyFn.mock.calls).toEqual([
            [[]],
            [[node1]],
            [[node1, node2]],
            [[node2]]
        ]);

        host.append(text1, text2);
        await delay();

        //TEST: Verify that the text node that is not an instance of mark is observed
        expect(spyFn.mock.calls).toEqual([
            [[]],
            [[node1]],
            [[node1, node2]],
            [[node2]],
            [[node2, text1]]
        ]);
    });

    it("useNodes - escapes", async () => {
        const host = document.createElement("div");
        document.body.append(host);

        const hooks = createHooks(load, host);

        const spyFn = vi.fn();

        function load() {
            hooks.render(() => {
                spyFn(useNodes());
            });
            hooks.dispatch(INSERTION_EFFECT);
            hooks.dispatch(LAYOUT_EFFECT);
            hooks.dispatch(EFFECT);
        }

        load();
        await delay();

        //TEST: Verify that no arguments have been assigned
        expect(spyFn.mock.calls).toEqual([[[]]]);
    });

    it("useNodes - escapes", async () => {
        const host = document.createElement("div");
        host.attachShadow({ mode: "open" });

        const node1 = document.createElement("h1");
        const node2 = document.createElement("h2");

        host.append(node1, node2);

        document.body.append(host);

        const hooks = createHooks(load, host);

        const spyFn = vi.fn();

        function load() {
            hooks.render(() => {
                useNodes(spyFn);
            });
            hooks.dispatch(INSERTION_EFFECT);
            hooks.dispatch(LAYOUT_EFFECT);
            hooks.dispatch(EFFECT);
        }

        load();
        await delay();

        //TEST: Verify that filter receives the desired arguments
        expect(spyFn.mock.calls).toEqual([[node1], [node2]]);
    });
});
