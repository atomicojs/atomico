import { expect } from "@esm-bundle/chai";
import {
    setEvent,
    setPropertyStyle,
    diffProps,
    setProperty,
} from "../render.js";

describe("src/render#setEvent", () => {
    it("setEvent", (done) => {
        const handlers = {};
        const handler = () => {
            done();
        };
        const container = document.createElement("div");
        //@ts-ignore
        setEvent(container, "click", handler, handlers);
        container.click();
    });
});

describe("src/render#setPropertyStyle", () => {
    it("setPropertyStyle", () => {
        const container = document.createElement("div");

        setPropertyStyle(container.style, "width", "100px");

        expect(container.style.width).to.equal("100px");
    });
});

describe("src/render#diffProps", () => {
    it("diffProps", () => {
        const container = document.createElement("div");
        const props = {};
        const nextProps = { class: "my-class" };
        const handlers = {};

        diffProps(container, props, nextProps, handlers, false);

        expect(container.className).to.equal("my-class");

        diffProps(container, nextProps, props, handlers, false);

        expect(container.className).to.equal("");
    });
});

describe("src/render#setProperty", () => {
    it("setProperty", () => {
        const container = document.createElement("div");
        const handlers = {};
        //@ts-ignore
        setProperty(container, "class", "", "my-class", false, handlers);

        expect(container.className).to.equal("my-class");
        //@ts-ignore
        setProperty(container, "class", "my-class", "", false, handlers);

        expect(container.className).to.equal("");
    });
});
