import { expect } from "@esm-bundle/chai";
import { createHooks } from "../create-hooks.js";
import { useProp } from "../custom-hooks/use-prop.js";
import { PropError } from "../../element/errors.js";

describe("src/hooks/custom-hooks/use-prop", () => {
    it("manipulation of the DOM object", () => {
        let el = document.createElement("div");
        let hooks = createHooks(null, el);
        let value1 = "...";
        let value2 = "___";
        //@ts-ignore
        el.age = value1;
        hooks.load(() => {
            let [state, setAge] = useProp("age");
            expect(state).to.equal(value1);
            setAge(value2);
        });
        //@ts-ignore
        expect(el.age).to.equal(value2);
    });
    it("Error", () => {
        let el = document.createElement("div");
        let hooks = createHooks(null, el);

        try {
            hooks.load(() => useProp("age"));
        } catch (e) {
            expect(e).to.deep.equal(
                new PropError(
                    el,
                    'For useProp("age"), the prop does not exist on the host.',
                    "age"
                )
            );
        }
    });
});
