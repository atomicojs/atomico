import { expect } from "@esm-bundle/chai";
import { useHook, createHooks, useRender, useHost } from "../create-hooks.js";

describe("src/hooks/create-hooks", () => {
    /**
     * verify that the api is kept as a return
     */
    it("hooks.properties", () => {
        function render() {}
        let hooks = createHooks(render);

        expect(hooks.load).instanceOf(Function);
        expect(hooks.cleanEffects).instanceOf(Function);
        expect(hooks.cleanEffects()).instanceOf(Function);
    });
    /**
     * Verify the execution of load
     */
    it("hooks.load", (done) => {
        let hooks = createHooks();
        hooks.load(done);
    });
    /**
     * Check the acceptance of the arguments in load
     */
    it("hooks.load: with arguments", (done) => {
        function render() {}
        let host = {};
        let hooks = createHooks(render, host);
        hooks.load(done);
    });
    /**
     * check if useRender syncs with createHook arguments
     */
    it("hooks.load: useRender", () => {
        function render() {}
        let host = {};
        let hooks = createHooks(render, host);
        hooks.load(() => {
            expect(useRender()).to.equal(render);
        });
    });
    /**
     * check if useRender syncs with createHook arguments
     */
    it("hooks.load: useHost", () => {
        function render() {}
        let host = {};
        let hooks = createHooks(render, host);
        hooks.load(() => {
            expect(useHost().current).to.equal(host);
        });
    });
    /**
     * check if useHook initializes the first argument
     */
    it("hooks: useHook", (done) => {
        let hooks = createHooks();
        hooks.load(() => {
            useHook(done);
        });
    });
    /**
     * The cycles must be the same in execution
     * since useHook only reflects the execution
     * in its first argument.
     *
     * To test this, multiple renderings are executed
     * expecting to have the same number of cycles
     *
     * In each execution use Hook must return the last
     * state associated with the hook render
     */
    it("hooks.load; useHost with render cycles", () => {
        let hooks = createHooks();

        let cycleRoot = 0;
        let cycleScope = 0;

        let hooksScope = () => {
            /**
             * In this case there is equality between returns
             * This spec checks that the first argument to useHook
             * is executed between renders and in turn holds the return as a state
             */
            expect(++cycleScope).to.equal(
                useHook((cycleHook = 0) => ++cycleHook)
            );
        };

        let runCycle = () => {
            ++cycleRoot;
            hooks.load(hooksScope);
            // clean useLayoutEffect and then useEffect
            hooks.cleanEffects()();
        };

        let size = 100;

        while (size--) {
            runCycle();
        }

        expect(cycleRoot).to.equal(cycleScope);
    });
    /**
     * The hook life cycle is transmitted internally by the useHook hook,
     * this resive 3 callback:
     *
     * arguments[0] - render callback
     * arguments[1] - layoutEffect callback, this must be executed with the first execution of clearEffect
     * arguments[2] - effect callback, this must be executed with the execution of clearEffect
     */
    it("hooks.load: order of execution of the hook cycle", () => {
        let hooks = createHooks();

        let steps = [];

        hooks.load(() => {
            useHook(
                () => {
                    steps.push("render");
                },
                () => {
                    steps.push("layoutEffect");
                },
                () => {
                    steps.push("effect");
                }
            );
        });

        expect(steps).to.deep.equal(["render"]);

        let clearLastEffects = hooks.cleanEffects();

        expect(steps).to.deep.equal(["render", "layoutEffect"]);

        clearLastEffects();

        expect(steps).to.deep.equal(["render", "layoutEffect", "effect"]);
    });

    //it("hooks.load: unmounted layoutEffect and useEffect", () => {});
});
