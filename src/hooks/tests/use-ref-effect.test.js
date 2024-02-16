import { expect } from "@esm-bundle/chai";
import { createHooks, useRef } from "../create-hooks.js";
import { useRefEffect } from "../custom-hooks/use-ref-effect.js";

describe("src/hooks/custom-hooks/use-ref-effect", () => {
    /**
     * By not using parameters to prevent the execution of useEffect,
     * the effect must execute the same number of times as the render
     */
    it("execution between updates without memorizing arguments", async () => {
        const host = {
            updated: Promise.resolve()
        };

        const hooks = createHooks(() => {
            throw "Updates should not be dispatched from useRefEffect";
        }, host);

        let cyclesEffect = 0;

        let load = () => {
            const ref = useRef(1);

            useRefEffect(() => {
                cyclesEffect++;
                return () => (cyclesEffect = 0);
            }, [ref]);

            return ref;
        };

        let update = () => {
            const ref = hooks.load(load);
            hooks.cleanEffects()()();
            return ref;
        };

        const ref = update();

        update();

        update();

        // batch
        let i = 10;

        while (--i) {
            ref.current++;
        }

        expect(ref.current).to.equal(10);

        await host.updated;

        expect(cyclesEffect).to.equal(1);

        hooks.cleanEffects(true)()();

        await host.updated;

        expect(cyclesEffect).to.equal(0);
    });
});
