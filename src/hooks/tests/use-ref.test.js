import { expect } from "@bundled-es-modules/chai";
import { createHooks } from "../create-hooks";
import { useRef } from "../hooks";

it("useEffect referencia persistente de creacion", () => {
    let render = () => {};
    let hooks = createHooks(render, null);

    let load = (param) => {
        let ref = useRef(param);
        return ref.current;
    };

    expect(hooks.load(load, true)).to.be.true;
    expect(hooks.load(load, false)).to.be.true;
});
