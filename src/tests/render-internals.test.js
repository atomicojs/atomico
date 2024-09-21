import { expect } from "@esm-bundle/chai";
import {
    setEvent,
    setPropertyStyle,
    renderProps,
    setProperty
} from "../render.js";

describe("src/render#setEvent", () => {
    it("setEvent", () => {
        /**
         * @type {import("vnode").Handlers}
         */
        const handlers = {};
        let count = 0;
        const handler = () => count++;
        const container = document.createElement("div");

        setEvent(container, "click", handler, handlers);
        container.click();

        setEvent(container, "click", null, handlers);
        container.click();

        expect(count).to.equal(1);
    });
});

describe("src/render#setPropertyStyle", () => {
    it("setPropertyStyle", () => {
        const container = document.createElement("div");

        setPropertyStyle(container.style, "width", "100px");

        expect(container.style.width).to.equal("100px");

        setPropertyStyle(container.style, "width", null);

        expect(container.style.width).to.equal("");

        setPropertyStyle(container.style, "--my-custom-property", "red");

        expect(
            container.style.getPropertyValue("--my-custom-property")
        ).to.equal("red");
    });
});

describe("src/render#renderProps", () => {
    it("renderProps", () => {
        const container = document.createElement("div");
        const props = {};
        const nextProps = { class: "my-class" };
        /**
         * @type {import("vnode").Handlers}
         */
        const handlers = {};

        renderProps(container, props, nextProps, handlers, false);

        expect(container.className).to.equal("my-class");

        renderProps(container, nextProps, props, handlers, false);

        expect(container.className).to.equal("");
    });
});

describe("src/render#setProperty", () => {
    it("setProperty", () => {
        const container = document.createElement("div");
        /**
         * @type {import("vnode").Handlers}
         */
        const handlers = {};
        setProperty(container, "class", "", "my-class", handlers, false);
        expect(container.className).to.equal("my-class");

        setProperty(container, "class", "my-class", "", handlers, false);
        expect(container.className).to.equal("");
    });

    it("setProperty#style", () => {
        const container = document.createElement("div");
        /**
         * @type {import("vnode").Handlers}
         */
        const handlers = {};

        setProperty(
            container,
            "style",
            { width: "0px" },
            {
                width: "100px"
            },
            handlers,
            false
        );

        expect(container.style.width).to.equal("100px");

        setProperty(container, "style", { width: "0px" }, "", handlers, false);

        expect(container.style.width).to.equal("");

        setProperty(container, "style", null, "width:200px", handlers, false);

        expect(container.style.width).to.equal("200px");

        setProperty(container, "style", { width: "0px" }, {}, handlers, false);

        expect(container.style.width).to.equal("");

        setProperty(
            container,
            "style",
            { width: "0px" },
            { width: "0px" },
            handlers,
            false
        );

        expect(container.style.width).to.equal("");
    });

    it("setProperty#$", () => {
        const container = document.createElement("input");
        /**
         * @type {import("vnode").Handlers}
         */
        const handlers = {};

        setProperty(container, "$value", null, "ok", handlers, false);

        expect(container.getAttribute("value")).to.equal("ok");
    });

    it("setProperty#$-serialize", () => {
        const container = document.createElement("input");
        /**
         * @type {import("vnode").Handlers}
         */
        const handlers = {};
        const data = { ok: 1 };

        setProperty(container, "$value", null, data, handlers, false);

        expect(container.value).to.equal(JSON.stringify(data));

        setProperty(
            container,
            "$value",
            JSON.stringify(data),
            null,
            handlers,
            false
        );

        expect(container.value).to.equal("");
    });

    it("setProperty#$ serialize array", () => {
        const container = document.createElement("input");
        /**
         * @type {import("vnode").Handlers}
         */
        const handlers = {};
        const data = [{ ok: 1 }];

        setProperty(container, "$value", null, data, handlers, false);

        expect(container.value).to.equal(JSON.stringify(data));

        setProperty(
            container,
            "$value",
            JSON.stringify(data),
            null,
            handlers,
            false
        );

        expect(container.value).to.equal("");
    });

    it("setProperty# _ escale", () => {
        const container = document.createElement("input");
        /**
         * @type {import("vnode").Handlers}
         */
        const handlers = {};
        const data = [{ ok: 1 }];

        setProperty(container, "_key", null, data, handlers, false);

        expect(container.getAttribute("_key")).to.equal(null);
        //@ts-ignore
        expect(container._key).to.equal(undefined);
    });

    it("setProperty# on ", () => {
        const container = document.createElement("input");
        /**
         * @type {import("vnode").Handlers}
         */
        const handlers = {};

        setProperty(container, "onclick", () => {}, false, handlers, false);
    });
});
