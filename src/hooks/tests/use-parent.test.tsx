import { expect, describe, it, vi } from "vitest";
import { c } from "../../element/custom-element.js";
import { useParent } from "../custom-hooks/use-parent.js";
import { live } from "../../tests/element.test.js";
import { delay } from "./utils.js";

describe("useParent", () => {
    it("finds parent by tag name selector", async () => {
        let parentRef;
        const Child = c(() => {
            parentRef = useParent("div");
            return <host />;
        });

        const child = live(Child);
        const parent = document.createElement("div");
        document.body.append(parent);
        parent.append(child);

        await delay();

        expect(parentRef.current).toBe(parent);
        parent.remove();
    });

    it("finds parent by constructor", async () => {
        let parentRef;
        const Child = c(() => {
            parentRef = useParent(HTMLFormElement);
            return <host />;
        });

        const child = live(Child);
        const parent = document.createElement("form");
        document.body.append(parent);
        parent.append(child);

        await delay();

        expect(parentRef.current).toBe(parent);
        parent.remove();
    });

    it("finds composed parent up through shadow dom and slots", async () => {
        let parentRef;
        const Child = c(() => {
            parentRef = useParent(HTMLElement, true);
            return <host />;
        });
        const child = live(Child);

        const Wrapper = c(() => {
            return <host><slot /></host>;
        });
        const wrapper = live(Wrapper);
        
        const parent = document.createElement("section");
        document.body.append(parent);
        parent.append(wrapper);
        wrapper.append(child);

        await delay();

        expect(parentRef.current).toBe(wrapper);
        parent.remove();
    });
});
