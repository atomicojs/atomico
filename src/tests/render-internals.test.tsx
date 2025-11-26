import { expect, describe, it } from "vitest";
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

        expect(count).toEqual(1);
    });
});

describe("src/render#setPropertyStyle", () => {
    it("setPropertyStyle", () => {
        const container = document.createElement("div");

        setPropertyStyle(container.style, "width", "100px");

        expect(container.style.width).toEqual("100px");

        setPropertyStyle(container.style, "width", null);

        expect(container.style.width).toEqual("");

        setPropertyStyle(container.style, "--my-custom-property", "red");

        expect(
            container.style.getPropertyValue("--my-custom-property")
        ).toEqual("red");
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

        expect(container.className).toEqual("my-class");

        renderProps(container, nextProps, props, handlers, false);

        expect(container.className).toEqual("");
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
        expect(container.className).toEqual("my-class");

        setProperty(container, "class", "my-class", "", handlers, false);
        expect(container.className).toEqual("");
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

        expect(container.style.width).toEqual("100px");

        setProperty(container, "style", { width: "0px" }, "", handlers, false);

        expect(container.style.width).toEqual("");

        setProperty(container, "style", null, "width:200px", handlers, false);

        expect(container.style.width).toEqual("200px");

        setProperty(container, "style", { width: "0px" }, {}, handlers, false);

        expect(container.style.width).toEqual("");

        setProperty(
            container,
            "style",
            { width: "0px" },
            { width: "0px" },
            handlers,
            false
        );

        expect(container.style.width).toEqual("");
    });

    it("setProperty#$", () => {
        const container = document.createElement("input");
        /**
         * @type {import("vnode").Handlers}
         */
        const handlers = {};

        setProperty(container, "$value", null, "ok", handlers, false);

        expect(container.getAttribute("value")).toEqual("ok");
    });

    it("setProperty#$-serialize", () => {
        const container = document.createElement("input");
        /**
         * @type {import("vnode").Handlers}
         */
        const handlers = {};
        const data = { ok: 1 };

        setProperty(container, "$value", null, data, handlers, false);

        expect(container.value).toEqual(JSON.stringify(data));

        setProperty(
            container,
            "$value",
            JSON.stringify(data),
            null,
            handlers,
            false
        );

        expect(container.value).toEqual("");
    });

    it("setProperty#$ serialize array", () => {
        const container = document.createElement("input");
        /**
         * @type {import("vnode").Handlers}
         */
        const handlers = {};
        const data = [{ ok: 1 }];

        setProperty(container, "$value", null, data, handlers, false);

        expect(container.value).toEqual(JSON.stringify(data));

        setProperty(
            container,
            "$value",
            JSON.stringify(data),
            null,
            handlers,
            false
        );

        expect(container.value).toEqual("");
    });

    it("setProperty# _ escale", () => {
        const container = document.createElement("input");
        /**
         * @type {import("vnode").Handlers}
         */
        const handlers = {};
        const data = [{ ok: 1 }];

        setProperty(container, "_key", null, data, handlers, false);

        expect(container.getAttribute("_key")).toEqual(null);
        //@ts-ignore
        expect(container._key).toEqual(undefined);
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
