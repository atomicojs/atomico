import { describe, expect, it } from "vitest";
import { c } from "../element/custom-element.js";
import { useRef } from "../hooks/create-hooks.js";
import { live } from "./element.test.js";

describe("Element with hooks", () => {
    it("useRef", async () => {
        let ref = {};

        const MyElement = c(() => {
            ref = useRef();
            return <host ref={ref} />;
        });

        const node = live(MyElement);

        await node.updated;

        expect(ref.current).toBeInstanceOf(node.constructor);
    });
});
