//@ts-ignore
import { expect } from "@bundled-es-modules/chai";
import { createHooks } from "../create-hooks";
import { useReducer } from "../hooks";

describe("src/hooks/use-state", () => {
    it("initialState", () => {
        let render = () => {};
        let hooks = createHooks(render, null);
        let initialState = {};
        let reducer = (state, action) => {};

        hooks.load(() => {
            let [state] = useReducer(reducer, initialState);
            expect(state).to.equal(initialState);
        }, null);
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
        }, null);

        hooks.load(() => {
            let [state] = useReducer(reducer, initialState);
            expect(state).to.equal(refAction.nextState);
        }, null);
    });
});
