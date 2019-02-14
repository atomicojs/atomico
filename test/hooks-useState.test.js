import { h, render, useState } from "../src/index";
import { container } from "./util";

describe("test with useState", () => {
    // verify that useState returns the desired state
    it("basic", () => {
        let scope = container(),
            initialState = 777;
        function Test() {
            let [state, setState] = useState(initialState);
            assert.equal(state, initialState);
        }
        render(<Test />, scope);
    });
    // verify that useState returns a state by invoking a function
    it("basic function", () => {
        let scope = container(),
            initialState = 777,
            returnState = () => initialState;
        function Test() {
            let [state, setState] = useState(returnState);
            assert.equal(state, initialState);
        }
        render(<Test />, scope);
    });
    /**
     * verify that useState modify its status
     * after 100 ms to state2.
     */
    it("basic loop", done => {
        let scope = container(),
            state1 = 0,
            state2 = 2;

        function Test() {
            let [state, setState] = useState(state1);
            if (state === state1) {
                setTimeout(() => {
                    setState(state2);
                    setTimeout(() => {}, 100);
                }, 100);
            } else {
                assert.equal(state, state2);
                done();
                return;
            }
            assert.equal(state, state1);
        }

        render(<Test />, scope);
    });
});
