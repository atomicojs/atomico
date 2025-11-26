import { expect, describe, it } from "vitest";

import { createElement, Fragment } from "../render.js";

describe("src/render#h", () => {
    it("JSX - pragma", () => {
        expect(<span></span>).toEqual({
            type: "span",
            props: {},
            key: undefined
        });

        const Img = new Image();
        expect(<Img />).toEqual({
            type: Img,
            props: {},
            key: undefined
        });

        expect(<Image />).toEqual({
            type: Image,
            props: {},
            key: undefined
        });
    });
    it("JSX - children ", () => {
        let children = 10;
        expect(<span>{children}</span>).toEqual({
            type: "span",
            props: { children },
            key: undefined
        });
    });
    it("JSX - special property staticNode", () => {
        expect(<span staticNode />).toEqual({
            type: "span",
            props: { staticNode: true },
            key: undefined
        });
    });
    it("JSX - special property cloneNode", () => {
        expect(<span cloneNode />).toEqual({
            type: "span",
            props: { cloneNode: true },
            key: undefined
        });
    });
    it("JSX - Fragment", () => {
        expect(createElement(Fragment)).toEqual([]);
        expect(<></>).toEqual([]);
    });
});
