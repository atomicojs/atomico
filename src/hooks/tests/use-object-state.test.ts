import { describe, expect, it } from "vitest";
import { createHooks } from "../create-hooks.js";
import { useObjectState } from "../custom-hooks/use-object-state.js";

describe("src/hooks/use-object-state", () => {
    it("initialization and basic object state rendering", () => {
        let renderCount = 0;
        let render = () => {
            renderCount++;
        };
        let hooks = createHooks(render);

        let load = () => {
            let [state] = useObjectState({ name: "Atomico", version: 1 });
            expect(state).to.deep.equal({ name: "Atomico", version: 1 });
        };

        hooks.render(load);
        expect(renderCount).to.equal(0); // Synchronous initial render does not trigger update callbacks
    });

    it("partial state updates via object merge", () => {
        let step = 0;
        let render = () => {
            hooks.render(load);
        };

        let hooks = createHooks(render);

        let load = () => {
            let [state, setState] = useObjectState({ name: "Atomico", version: 1 });
            
            if (step === 0) {
                expect(state).to.deep.equal({ name: "Atomico", version: 1 });
                step = 1;
                setState({ version: 2 });
            } else if (step === 1) {
                expect(state).to.deep.equal({ name: "Atomico", version: 2 });
                step = 2;
                setState({ name: "Super Atomico" });
            } else if (step === 2) {
                expect(state).to.deep.equal({ name: "Super Atomico", version: 2 });
            }
        };

        render();
        expect(step).to.equal(2);
    });

    it("updates state using functional callbacks", () => {
        let step = 0;
        let render = () => {
            hooks.render(load);
        };

        let hooks = createHooks(render);

        let load = () => {
            let [state, setState] = useObjectState({ clicks: 0 });

            if (step === 0) {
                expect(state).to.deep.equal({ clicks: 0 });
                step = 1;
                setState((prev) => ({ clicks: prev.clicks + 1 }));
            } else if (step === 1) {
                expect(state).to.deep.equal({ clicks: 1 });
            }
        };

        render();
        expect(step).to.equal(1);
    });

    it("prevents re-renders when incoming partial values are identical", () => {
        let renderCount = 0;
        let render = () => {
            renderCount++;
            hooks.render(load);
        };

        let hooks = createHooks(render);

        let load = () => {
            let [, setState] = useObjectState({ name: "Antigravity", count: 10 });

            if (renderCount === 1) {
                // Dispatching identical property should not enqueue a second render
                setState({ name: "Antigravity" });
            }
        };

        render();
        expect(renderCount).to.equal(1); // Rendered exactly once
    });
});
