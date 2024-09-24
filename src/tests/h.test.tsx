import { expect, describe, it } from "vitest";

import { h, TYPE, defaultRender, TYPE_VNODE } from "../render.js";

describe("src/render#h", () => {
    it("pragma#type", () => {
        expect(h("span")).toEqual({
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

        const img = new Image();
        expect(h(img)).toEqual({
            [TYPE]: TYPE_VNODE,
            type: img,
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

        expect(h(Image)).toEqual({
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
    it("pragma#props", () => {
        let children = 10;
        expect(h("span", { children })).toEqual({
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

        expect(h("span", {}, children)).toEqual({
            [TYPE]: TYPE_VNODE,
            type: "span",
            props: {},
            children: [children],
            key: undefined,
            shadow: undefined,
            static: undefined,
            clone: undefined,
            raw: false,
            is: undefined,
            render: defaultRender
        });
    });
    it("pragma#props.staticNode", () => {
        expect(h("span", { staticNode: true })).toEqual({
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
    it("pragma#props.cloneNode", () => {
        expect(h("span", { cloneNode: true })).toEqual({
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
});
