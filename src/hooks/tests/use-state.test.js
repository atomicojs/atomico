import { expect } from "@bundled-es-modules/chai";
import { createHooks } from "../create-hooks";
import { useState } from "../hooks";

describe("use-state", () => {
    it("single execution", () => {
        let cycles = 0;
        let render = () => {
            expect(cycles).to.equal(1);
        };
        let hooks = createHooks(render, null);

        let load = () => {
            let [, setState] = useState(0);
            cycles++;
            setState();
        };

        hooks.load(load, null);
    });

    it("update cycle and executable status", async (resolve) => {
        let loop = 3;

        let render = () => {
            if (loop) {
                hooks.load(load, null);
                hooks.updated();
            } else {
                resolve();
            }
        };

        let hooks = createHooks(render, null);

        let load = () => {
            let [state, setState] = useState(loop);
            expect(state).to.equal(loop);
            setState(() => --loop);
        };

        render();
    });
});
