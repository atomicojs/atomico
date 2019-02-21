import { container } from "../../util";
import { h, render, useState } from "../../../src";

describe("test useState", () => {
    // verify that useState returns the desired state
    test("basic", () => {
        let scope = container(),
            initialState = 777;

        function Test() {
            let [state, setState] = useState(initialState);
            expect(state).toBe(initialState);
        }
        render(<Test />, scope);
    });
    // verify that useState returns a state by invoking a function
    test("basic function", () => {
        let scope = container(),
            initialState = 777,
            returnState = () => initialState;
        function Test() {
            let [state, setState] = useState(returnState);
            expect(state).toBe(initialState);
        }
        render(<Test />, scope);
    });
    /**
     * verify that useState modify its status
     * after 100 ms to state2.
     */
    test("basic loop", done => {
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
                expect(state).toBe(state2);
                done();
                return;
            }
            expect(state).toBe(state1);
        }

        render(<Test />, scope);
    });
});
