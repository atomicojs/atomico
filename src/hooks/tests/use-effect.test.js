import { expect } from "@esm-bundle/chai";
import { createHooks } from "../create-hooks";
import { useEffect } from "../hooks";

describe("src/hooks/use-effect", () => {
    it("execution between updates without memorizing arguments", () => {
        let hooks = createHooks();
        let cycles = 0;
        let cyclesEffect = 0;
        let load = () => {
            cycles++;
            useEffect(() => {
                cyclesEffect++;
            });
        };

        let update = () => {
            hooks.load(load);
            hooks.cleanEffects()();
        };

        update();
        update();
        update();

        expect(cycles).to.equal(cyclesEffect);
    });

    it("execution between updates without memorizing arguments", () => {
        let render = () => {};
        let hooks = createHooks(render, null);
        let cycles = 0;
        let cyclesEffect = 0;
        let cycleDiff = 0;

        let load = (param) => {
            cycles++;
            useEffect(() => {
                cyclesEffect++;
                return () => cycleDiff++;
            }, [param]);
        };

        let update = (param) => {
            hooks.load(() => load(param));
            hooks.cleanEffects()();
        };

        update(1);
        update(1);
        update(2);
        update(2);
        update(3);

        expect(cycles - cycleDiff).to.equal(cyclesEffect);
    });
});
