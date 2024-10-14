import { expect, describe, it } from "vitest";

import { h, TYPE, defaultRender, TYPE_VNODE, Fragment } from "../render.js";

describe("src/render#h", () => {
    it("JSX - pragma", () => {
        expect(<span></span>).toEqual({
            [TYPE]: TYPE_VNODE,
            type: "span",
            props: {},
            children: [],
            key: undefined,
            shadow: undefined,
            static: undefined,
            clone: undefined,
            raw: false,
            is: undefined,
            render: defaultRender
        });

        const Img = new Image();
        expect(<Img />).toEqual({
            [TYPE]: TYPE_VNODE,
            type: Img,
            props: {},
            children: [],
            key: undefined,
            shadow: undefined,
            static: undefined,
            clone: undefined,
            raw: 1,
            is: undefined,
            render: defaultRender
        });

        expect(<Image />).toEqual({
            [TYPE]: TYPE_VNODE,
            type: Image,
            props: {},
            children: [],
            key: undefined,
            shadow: undefined,
            static: undefined,
            clone: undefined,
            raw: 2,
            is: undefined,
            render: defaultRender
        });
    });
    it("JSX - children ", () => {
        let children = 10;
        expect(<span>{children}</span>).toEqual({
            [TYPE]: TYPE_VNODE,
            type: "span",
            props: { children },
            children: children,
            key: undefined,
            shadow: undefined,
            static: undefined,
            clone: undefined,
            raw: false,
            is: undefined,
            render: defaultRender
        });
    });
    it("JSX - special property staticNode", () => {
        expect(<span staticNode />).toEqual({
            [TYPE]: TYPE_VNODE,
            type: "span",
            props: { staticNode: true },
            children: [],
            key: undefined,
            shadow: undefined,
            static: true,
            clone: undefined,
            raw: false,
            is: undefined,
            render: defaultRender
        });
    });
    it("JSX - special property cloneNode", () => {
        expect(<span cloneNode />).toEqual({
            [TYPE]: TYPE_VNODE,
            type: "span",
            props: { cloneNode: true },
            children: [],
            key: undefined,
            shadow: undefined,
            static: undefined,
            clone: true,
            raw: false,
            is: undefined,
            render: defaultRender
        });
    });
    it("JSX - Fragment", () => {
        expect(h(Fragment)).toEqual([]);
        expect(<></>).toEqual([]);
    });
});
