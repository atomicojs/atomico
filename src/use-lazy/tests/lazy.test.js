import { h } from "../../core/core";
import { createRenderHook } from "../../tests/utils";

import {
    useLazy,
    LAZY_STATE_LOADING,
    LAZY_STATE_ERROR,
    LAZY_STATE_DONE
} from "../use-lazy";

let asyncSuccess = (data, ms = 0) =>
    new Promise(resolve => setTimeout(resolve, ms, data));
let asyncError = data =>
    new Promise((resolve, reject) => setTimeout(reject, 0, data));

describe("atomico/use-lazy", () => {
    it("{ useLazy } done", async () => {
        let render = createRenderHook();
        let data = { default: "success" };

        render((prop, cycle) => {
            let [state, result] = useLazy(() => asyncSuccess(data), true);
            switch (cycle) {
                case 1:
                    expect(state).toBe(LAZY_STATE_DONE);
                    expect(result).toBe(data.default);
                    break;
            }
        });
    });
    it("{ useLazy } error", async () => {
        let render = createRenderHook();

        render((prop, cycle) => {
            let [state, result] = useLazy(() => asyncError(), true);
            switch (cycle) {
                case 1:
                    expect(state).toBe(LAZY_STATE_ERROR);
                    break;
            }
        });
    });
    it("{ useLazy } loading", async () => {
        let render = createRenderHook();
        let data = { default: "success" };

        render((prop, cycle) => {
            let [state, result] = useLazy(() => asyncSuccess(data, 500), true);
            switch (cycle) {
                case 0:
                    expect(state).toBe(undefined);
                    break;
                case 1:
                    expect(state).toBe(LAZY_STATE_LOADING);
                    break;
                case 2:
                    expect(state).toBe(LAZY_STATE_DONE);
                    expect(result).toBe(data.default);
                    break;
            }
        });
    });
});
