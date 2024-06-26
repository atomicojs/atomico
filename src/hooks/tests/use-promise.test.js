import { expect } from "@esm-bundle/chai";
import { createHooks } from "../create-hooks.js";
import { usePromise } from "../custom-hooks/use-promise.js";
import { useAbortController } from "../custom-hooks/use-abort-controller.js";

describe("usePromise", () => {
    it("fulfilled", (done) => {
        let cycle = 0;
        const host = document.createElement("div");
        const load = () => {
            const promise = usePromise(async () => 10, []);

            switch (cycle++) {
                case 0:
                    expect(promise).to.deep.equal({ pending: true });
                    break;
                case 1:
                    expect(promise).to.deep.equal({
                        result: 10,
                        fulfilled: true
                    });
                    done();
                    break;
            }
        };

        const render = () => hooks.load(load);

        const hooks = createHooks(render, host);

        render();

        hooks.cleanEffects()()();
    });
    it("rejected", (done) => {
        let cycle = 0;
        const host = document.createElement("div");
        const load = () => {
            const controller = useAbortController([]);
            const promise = usePromise(
                () => fetch("any", { signal: controller.signal }),
                []
            );
            controller.abort();
            switch (cycle++) {
                case 0:
                    expect(promise).to.deep.equal({ pending: true });
                    break;

                case 1:
                    expect(promise).to.deep.equal({
                        result: promise.result,
                        aborted: true
                    });
                    done();
                    break;
            }
        };

        const render = () => hooks.load(load);

        const hooks = createHooks(render, host);

        render();

        hooks.cleanEffects()()();
    });
});
