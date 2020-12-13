import { expect } from "@esm-bundle/chai";
import { useHook, createHooks, useRender, useHost } from "../create-hooks.js";

describe("src/hooks/create-hooks", () => {
    it("hooks.properties", () => {
        function render() {}
        let hooks = createHooks(render);

        expect(hooks.load).instanceOf(Function);
        expect(hooks.updated).instanceOf(Function);
    });

    it("hooks.load", () => {
        function render() {}
        let host = {};
        let hooks = createHooks(render, host);
        let param = {};
        hooks.load((param) => expect(param).to.equal(param), param);
    });

    it("hooks > useRender", () => {
        function render() {}
        let host = {};
        let hooks = createHooks(render, host);
        hooks.load(() => {
            expect(useRender()).to.equal(render);
        }, null);
    });

    it("hooks > useHost", () => {
        function render() {}
        let host = {};
        let hooks = createHooks(render, host);
        hooks.load(() => {
            expect(useHost().current).to.equal(host);
        }, null);
    });

    it("hooks > useHook", (done) => {
        function render() {}
        let host = {};
        let hooks = createHooks(render, host);
        hooks.load(() => {
            useHook(() => {
                done();
            });
        }, null);
    });

    it("hooks.(updated|unmount) > useHook", () => {
        function render() {}
        let host = {};
        let hooks = createHooks(render, host);

        let cycle = 0;
        let steps = {};

        let hooksScope = (cycle) => {
            useHook((state = []) => {
                return (steps[cycle] = [...state, cycle]);
            });
        };

        let runCycle = (unmount) => {
            hooks.load(hooksScope, cycle++);
            hooks.updated(unmount);
        };

        runCycle();
        runCycle();
        runCycle(true);

        expect(steps[0]).to.deep.equal([0]); // mount - mounted
        expect(steps[1]).to.deep.equal([0, 1]); // update - updated
        expect(steps[2]).to.deep.equal([0, 1, 2]); // update - unmount

        expect(cycle).to.equal(3); // if it were older, additional cycles would be generated
    });
});
