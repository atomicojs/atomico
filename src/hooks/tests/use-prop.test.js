//@ts-ignore
import { expect } from "@esm-bundle/chai";
import { createHooks } from "../create-hooks";
import { useProp } from "../custom-hooks/use-prop";

describe("src/hooks/custom-hooks/use-prop", () => {
    it("manipulation of the DOM object", () => {
        let render = () => {};
        let el = document.createElement("div");
        let hooks = createHooks(render, el);
        let value1 = "...";
        let value2 = "___";
        //@ts-ignore
        el.age = value1;
        hooks.load(() => {
            let [state, setAge] = useProp("age");
            expect(state).to.equal(value1);
            setAge(value2);
        }, null);
        //@ts-ignore
        expect(el.age).to.equal(value2);
    });
});
