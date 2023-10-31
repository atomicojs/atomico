import { expect } from "@esm-bundle/chai";
import { createHooks } from "../create-hooks.js";
import { useSuspense, useAsync } from "../custom-hooks/use-suspense.js";

describe("useSuspense", () => {
    it("fulfilled", (done) => {
        let cycleParent = 0;
        let cycleChild = 0;

        const parent = document.createElement("div");
        const child = document.createElement("div");

        parent.append(child);

        const parentLoad = () => {
            const status = useSuspense();

            switch (cycleParent++) {
                case 0:
                    expect(status).to.deep.equal({ pending: true });
                    break;
                case 1:
                    expect(status).to.deep.equal({ fulfilled: true });
                    break;
                // no default
            }
        };

        const childLoad = () => {
            const result = useAsync(async () => {
                await new Promise((resolve) => setTimeout(resolve, 200));
                return { ok: "success!" };
            }, []);

            switch (cycleChild++) {
                case 0:
                    expect(result).to.deep.equal({ ok: "success!" });
                    done();
                    break;
                // no default
            }
        };

        const parentRender = () => {
            parentHooks.load(parentLoad);
            parentHooks.cleanEffects()()();
        };

        const parentHooks = createHooks(parentRender, parent);

        parentRender();

        const childRender = () => {
            childHooks.load(childLoad);
            childHooks.cleanEffects()()();
        };

        const childHooks = createHooks(childRender, child);

        childRender();
    });
    it("rejected", (done) => {
        let cycleParent = 0;
        let cycleChild = 0;

        const parent = document.createElement("div");
        const child = document.createElement("div");

        parent.append(child);

        const parentLoad = () => {
            const status = useSuspense();

            switch (cycleParent++) {
                case 0:
                    expect(status).to.deep.equal({ pending: true });
                    break;
                case 1:
                    expect(status).to.deep.equal({ fulfilled: true });
                    break;
                // no default
            }
        };

        const childLoad = () => {
            const result = useAsync(
                () =>
                    new Promise((resolve, reject) =>
                        setTimeout(reject, 200, { ok: "rejected!" })
                    ),
                []
            );

            switch (cycleChild++) {
                case 0:
                    expect(result).to.deep.equal({ ok: "rejected!" });
                    done();
                    break;
                // no default
            }
        };

        const parentRender = () => {
            parentHooks.load(parentLoad);
            parentHooks.cleanEffects()()();
        };

        const parentHooks = createHooks(parentRender, parent);

        parentRender();

        const childRender = () => {
            childHooks.load(childLoad);
            childHooks.cleanEffects()()();
        };

        const childHooks = createHooks(childRender, child);

        childRender();
    });
});
