import { expect } from "@esm-bundle/chai";
import { flat, setEvent } from "../render.js";
import html from "../../html/html";

describe("src/render#flat", () => {
    it("flatDeep", () => {
        const vnode = html`<div></div>`;
        const children = flat([
            vnode,
            [vnode, vnode, vnode],
            [[vnode, vnode, vnode]],
        ]);
        expect(children.length).to.equal(7);
    });
    it("flatDeep null", () => {
        const ref = html`<div></div>`;
        const vnode = html`${null}${() => {}}${false}${[ref]}`;

        //@ts-ignore
        const result = flat(vnode);

        expect(result.length).to.equal(4);

        expect(result).deep.equal(["", "", "", ref]);
    });
    it("flatDeep saniate", () => {
        const script = html`<script>
            alert();
        </script>`;

        const vnode = html`<style>
            ${script}
        </style>`;
        //@ts-ignore
        expect(flat(vnode.children, true)).deep.equal([""]);
    });
});

describe("src/render#setEvent", () => {
    it("flatDeep", (done) => {
        const handlers = {};
        const handler = () => {
            done();
        };
        const container = document.createElement("div");
        setEvent(container, "onclick", handler, handlers);
        container.click();
    });
});
