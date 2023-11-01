import { expect } from "@esm-bundle/chai";
import { createHooks } from "../create-hooks.js";
import { useReducer } from "../hooks.js";

describe("src/hooks/use-state", () => {
    it("initialState", () => {
        let hooks = createHooks();
        let initialState = {};
        let reducer = () => {};

        hooks.load(() => {
            let [state] = useReducer(reducer, initialState);
            expect(state).to.equal(initialState);
        });
    });

    it("Initial state from initializerFunction", () => {
        let hooks = createHooks();
        let count = 0;
        let stateInitializer = (initialArg) => {
            count++;
            return `${initialArg}Called`;
        };

        let reducer = () => {};
        const load = () => {
            let [state] = useReducer(
                reducer,
                "stateInitializer",
                stateInitializer,
            );

            return state;
        };

        let length = 5;

        while (length--) {
            expect(hooks.load(load)).to.equal("stateInitializerCalled");
        }

        expect(count).to.equal(1);
    });

    it("Update from reducer", () => {
        let render = () => {};
        let hooks = createHooks(render, null);
        let initialState = {};
        let refAction = { nextState: [] };
        let reducer = (state, action) => {
            expect(action).to.equal(refAction);
            return action.nextState;
        };

        hooks.load(() => {
            let [, dispatch] = useReducer(reducer, initialState);
            dispatch(refAction);
        });

        hooks.load(() => {
            let [state] = useReducer(reducer, initialState);
            expect(state).to.equal(refAction.nextState);
        });
    });

    it("Call lazy state initializer only one time", () => {
        let initializerCalls = 0;
        let render = () => {
            expect(initializerCalls).to.equal(1);
        };
        let hooks = createHooks(render, null);
        let initialState = {};
        let stateInitializer = (initArg) => {
            initializerCalls++;
            return initArg;
        };
        let refAction = { nextState: [] };
        let reducer = (state, action) => {
            expect(action).to.equal(refAction);
            return action.nextState;
        };

        hooks.load(() => {
            let [, dispatch] = useReducer(
                reducer,
                initialState,
                stateInitializer,
            );
            dispatch(refAction);
        });

        hooks.load(() => {
            let [state] = useReducer(reducer, initialState, stateInitializer);
            expect(state).to.equal(refAction.nextState);
        });
    });
});
