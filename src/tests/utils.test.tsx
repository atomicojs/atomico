import { describe, expect, it, vi } from "vitest";
import {
    isEqualArray,
    isFunction,
    isObject,
    flat,
    addListener
} from "../utils.js";

describe("src/utils", () => {
    it("utils - isEqualArray", () => {
        expect(isEqualArray([1, 2, 3, 4], [1, 2, 3, 4])).to.be.true;
        expect(isEqualArray([1, 2, 3, 4], [1, 2, 3])).to.be.false;
        expect(isEqualArray([5, 1, 2, 3], [1, 2, 3, 5])).to.be.false;
        expect(isEqualArray([], [])).to.be.true;
    });

    it("utils - isFunction", () => {
        expect(isFunction(() => {})).to.be.true;
        expect(isFunction(null)).to.be.false;
        expect(isFunction(Function())).to.be.true;
        expect(isFunction(1)).to.be.false;
    });

    it("utils - isObject", () => {
        expect(isObject(() => {})).to.be.false;
        expect(isObject(null)).to.be.true;
        expect(isObject([])).to.be.true;
        expect(isObject(1)).to.be.false;
    });

    it("utils - flat with argument escaping", () => {
        const callback = vi.fn();
        flat([[1, 2, 3], [[[false, null, undefined, 4, () => {}]]]], callback);
        expect(callback).toBeCalledTimes(1);
        expect(callback).toBeCalledWith("1234");
    });

    it("utils - flat with string concatenation", () => {
        const callback = vi.fn();
        flat([["h", "e", "ll", , "o"]], callback);
        expect(callback).toBeCalledTimes(1);
        expect(callback).toBeCalledWith("hello");
    });

    it("utils - flat with string concatenation", () => {
        const callback = vi.fn();
        const args = [["hell"], "o", new Text(""), new Text("")];
        flat(args, callback);
        expect(callback).toBeCalledTimes(3);
        expect(callback).toBeCalledWith("hello");
        expect(callback).toBeCalledWith(args.at(2));
        expect(callback).toBeCalledWith(args.at(3));
    });

    it("utils - addListener", () => {
        const handler = vi.fn();
        const host = document.createElement("div");
        const unlistener = addListener(host, "my-event", handler);
        const dispatch = () => host.dispatchEvent(new Event("my-event"));

        dispatch();
        dispatch();
        unlistener();

        dispatch();

        expect(handler).toBeCalledTimes(2);
    });
});
