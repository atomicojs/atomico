import { describe, expect, it, vi } from "vitest";
import { createHooks } from "../create-hooks.js";
import { usePromise } from "../custom-hooks/use-promise.js";
import { useAbortController } from "../custom-hooks/use-abort-controller.js";

describe("usePromise", () => {
    it("fulfilled", async () => {
        let cycle = 0;
        const done = vi.fn().mockResolvedValueOnce(undefined);

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

        await done;

        expect(done).toBeCalledTimes(1);
    });
    it("rejected", async () => {
        let cycle = 0;
        const host = document.createElement("div");
        const done = vi.fn().mockResolvedValueOnce(undefined);
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

        await done;

        expect(done).toBeCalledTimes(1);
    });
});
