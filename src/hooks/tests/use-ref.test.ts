import { describe, expect, it } from "vitest";
import { createHooks, useRef } from "../create-hooks.js";

describe("src/hooks/use-ref", () => {
    it("referencia persistente de creacion", () => {
        let render = () => {};
        let hooks = createHooks(render, null);

        let load = (param) => {
            let ref = useRef(param);
            return ref.current;
        };

        expect(hooks.render(() => load(true))).to.be.true;
        expect(hooks.render(() => load(false))).to.be.true;
    });
});
