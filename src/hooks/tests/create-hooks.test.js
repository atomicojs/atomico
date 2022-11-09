import { expect } from "@esm-bundle/chai";
import {
    useHook,
    createHooks,
    useUpdate,
    useHost,
    IdEffect,
    IdInsertionEffect,
    IdLayoutEffect,
} from "../create-hooks.js";

describe("src/hooks/create-hooks", () => {
    /**
     * verify that the api is kept as a return
     */
    it("hooks.properties", () => {
        function update() {}
        let hooks = createHooks(update);

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
        function update() {}
        let host = {};
        let hooks = createHooks(update, host);
        hooks.load(done);
    });
    /**
     * check if useUpdate syncs with createHook arguments
     */
    it("hooks.load: useUpdate", () => {
        function update() {}
        let host = {};
        let hooks = createHooks(update, host);
        hooks.load(() => {
            expect(useUpdate()).to.equal(update);
        });
    });
    /**
     * check if useUpdate syncs with createHook arguments
     */
    it("hooks.load: useHost", () => {
        function update() {}
        let host = {};
        let hooks = createHooks(update, host);
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
     * To test this, multiple updates are run
     * expecting to have the same number of cycles
     *
     * In each execution, the Hook must return the last
     * condition
     */
    it("hooks.load; useHost with cycle update", () => {
        let hooks = createHooks();

        let cycleRoot = 0;
        let cycleScope = 0;

        let hooksScope = () => {
            /**
             * In this case there is equality between returns
             * This spec checks that the first argument to useHook
             * runs between updates and in turn keeps the return as a state
             */
            expect(++cycleScope).to.equal(
                useHook((cycleHook = 0) => ++cycleHook)
            );
        };

        let runCycle = () => {
            ++cycleRoot;
            hooks.load(hooksScope);
            // clean useLayoutEffect and then useEffect
            hooks.cleanEffects()()();
        };

        let size = 100;

        while (size--) {
            runCycle();
        }

        expect(cycleRoot).to.equal(cycleScope);
    });
    /**
     * @todo !
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
                    steps.push("render 1");
                },
                () => {
                    steps.push("InsertionEffect");
                },
                IdInsertionEffect
            );
            useHook(
                () => {
                    steps.push("render 2");
                },
                () => {
                    steps.push("LayoutEffect");
                },
                IdLayoutEffect
            );
            useHook(
                () => {
                    steps.push("render 3");
                },
                () => {
                    steps.push("Effect");
                },
                IdEffect
            );
        });

        hooks.cleanEffects()()();

        expect(steps).to.deep.equal([
            "render 1",
            "render 2",
            "render 3",
            "InsertionEffect",
            "LayoutEffect",
            "Effect",
        ]);
    });

    it("hooks.load: unmounted layoutEffect and useEffect", () => {});
});
