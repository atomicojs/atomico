import { expect } from "@esm-bundle/chai";
import { createRef, Ref } from "../ref.js";

describe("src/element/create-ref", () => {
    it("createRef", async () => {
        const ref = createRef();
        expect(ref).to.instanceOf(Ref);
    });
    it("createRef - value", async () => {
        const ref = createRef(10);
        expect(ref.current).to.equal(10);
    });
    it("createRef - on", async () => {
        const ref = createRef(10);

        const off = ref.on(() => {
            expect(ref.current).to.equal(11);
        });

        ref.current++;

        ref.current = 11;

        off();

        ref.current++;
    });
});
