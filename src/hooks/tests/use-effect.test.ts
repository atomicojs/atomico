import { describe, expect, it, vi } from "vitest";
import { createHooks, UNMOUNT } from "../create-hooks.js";
import { useEffect, EFFECT } from "../use-effect.js";

describe("src/hooks/use-effect", () => {
    /**
     * By not using parameters to prevent the execution of useEffect,
     * the effect must execute the same number of times as the render
     */
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
            hooks.render(load);
            hooks.dispatch(EFFECT);
        };

        update();
        update();
        update();

        expect(cycles).to.equal(cyclesEffect);
    });
    /**
     * When using parameters to prevent useEffect from executing,
     * the effect should execute the same amount on parameter changes
     */
    it("execution between updates without memorizing arguments", () => {
        let hooks = createHooks();
        // counter of the execution of each render
        let cycles = 0;
        // Counter of each execution of the effect execution
        let cyclesEffect = 0;
        // Counter for each run of the effect collector run
        let cycleDiff = 0;

        let load = (param) => {
            cycles++;
            useEffect(() => {
                cyclesEffect++;
                return () => cycleDiff++;
            }, [param]);
        };

        let update = (param) => {
            hooks.render(() => load(param));
            hooks.dispatch(EFFECT);
        };

        update(1);
        update(1);
        update(2);
        update(2);
        update(3);

        expect(cycles - cycleDiff).to.equal(cyclesEffect);
    });
    /**
     * If the effect has been instantiated and the hook is unmounted,
     * the effect collector must be executed.
     */
    it("useEffect cleaning effect", () => {
        const done = vi.fn();
        function load() {
            useEffect(() => done, []);
        }
        let hooks = createHooks();

        hooks.render(load);
        // Initialize the effect
        hooks.dispatch(EFFECT);
        // Unmount effect
        hooks.dispatch(UNMOUNT);
    });
});
