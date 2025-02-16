import { describe, expect, it, vi } from "vitest";
import { useHook, createHooks, useUpdate, useHost } from "../create-hooks.js";

describe("src/hooks/create-hooks", () => {
    /**
     * verify that the api is kept as a return
     */
    it("hooks.properties", () => {
        function update() {}
        let hooks = createHooks(update);

        expect(hooks.render).instanceOf(Function);
        expect(hooks.dispatch).instanceOf(Function);
        expect(hooks.isSuspense).instanceOf(Function);
    });
    /**
     * Verify the execution of load
     */
    it("hooks.render", () => {
        let hooks = createHooks();
        hooks.render(vi.fn());
    });
    /**
     * Check the acceptance of the arguments in load
     */
    it("hooks.render: with arguments", () => {
        function update() {}
        let host = {};
        let hooks = createHooks(update, host);
        hooks.render(vi.fn());
    });
    /**
     * check if useUpdate syncs with createHook arguments
     */
    it("hooks.render: useUpdate", () => {
        function update() {}
        let host = {};
        let hooks = createHooks(update, host);
        hooks.render(() => {
            expect(useUpdate()).to.equal(update);
        });
    });
    /**
     * check if useUpdate syncs with createHook arguments
     */
    it("hooks.render: useHost", () => {
        function update() {}
        let host = {};
        let hooks = createHooks(update, host);
        hooks.render(() => {
            expect(useHost().current).to.equal(host);
        });
    });
    /**
     * check if useHook initializes the first argument
     */
    it("hooks: useHook", () => {
        let hooks = createHooks();
        hooks.render(() => {
            useHook(vi.fn());
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
    it("hooks.render; useHost with cycle update", () => {
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
            hooks.render(hooksScope);
        };

        let size = 100;

        while (size--) {
            runCycle();
        }

        expect(cycleRoot).to.equal(cycleScope);
    });
});
