import { expect } from "@esm-bundle/chai";
import {
    setEvent,
    setPropertyStyle,
    diffProps,
    setProperty,
} from "../render.js";

describe("src/render#setEvent", () => {
    it("setEvent", () => {
        const handlers = {};
        let count = 0;
        const handler = () => count++;
        const container = document.createElement("div");
        //@ts-ignore
        setEvent(container, "click", handler, handlers);
        container.click();
        // @ts-ignore
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

        setPropertyStyle(container.style, "width", 100);

        expect(container.style.width).to.equal("100px");

        setPropertyStyle(container.style, "width", null);

        expect(container.style.width).to.equal("");

        setPropertyStyle(container.style, "lineHeight", 1);

        expect(container.style.lineHeight).to.equal("1");

        setPropertyStyle(container.style, "float", "left");

        expect(container.style.float).to.equal("left");

        setPropertyStyle(container.style, "flex", 1);

        expect(container.style.flex).to.equal("1 1 0%");

        setPropertyStyle(container.style, "WebkitLineClamp", 2);

        expect(container.style.webkitLineClamp).to.equal("2");

        setPropertyStyle(container.style, "--my-custom-property", "red");

        expect(
            container.style.getPropertyValue("--my-custom-property")
        ).to.equal("red");
    });
});

describe("src/render#diffProps", () => {
    it("diffProps", () => {
        const container = document.createElement("div");
        const props = {};
        const nextProps = { class: "my-class" };
        const handlers = {};

        // @ts-ignore
        diffProps(container, props, nextProps, handlers, false);

        expect(container.className).to.equal("my-class");

        // @ts-ignore
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

    it("setProperty#style", () => {
        const container = document.createElement("div");
        const handlers = {};
        setProperty(
            container,
            "style",
            { width: "0px" },
            {
                width: "100px",
            },
            false,
            // @ts-ignore
            handlers
        );

        expect(container.style.width).to.equal("100px");

        setProperty(container, "style", { width: "0px" }, "", false, handlers);

        expect(container.style.width).to.equal("");

        setProperty(container, "style", null, "width:200px", false, handlers);

        expect(container.style.width).to.equal("200px");

        setProperty(container, "style", { width: "0px" }, {}, false, handlers);

        expect(container.style.width).to.equal("");

        setProperty(
            container,
            "style",
            { width: "0px" },
            { width: "0px" },
            false,
            handlers
        );

        expect(container.style.width).to.equal("");
    });

    it("setProperty#$", () => {
        const container = document.createElement("input");
        const handlers = {};

        setProperty(container, "$value", null, "ok", handlers);

        expect(container.getAttribute("value")).to.equal("ok");
    });

    it("setProperty#$-serialize", () => {
        const container = document.createElement("input");
        const handlers = {};
        const data = { ok: 1 };

        setProperty(container, "$value", null, data, false, handlers);

        expect(container.value).to.equal(JSON.stringify(data));

        setProperty(
            container,
            "$value",
            JSON.stringify(data),
            null,
            false,
            handlers
        );

        expect(container.value).to.equal("");
    });

    it("setProperty#$ serialize array", () => {
        const container = document.createElement("input");
        const handlers = {};
        const data = [{ ok: 1 }];

        setProperty(container, "$value", null, data, false, handlers);

        expect(container.value).to.equal(JSON.stringify(data));

        setProperty(
            container,
            "$value",
            JSON.stringify(data),
            null,
            false,
            handlers
        );

        expect(container.value).to.equal("");
    });

    it("setProperty# _ escale", () => {
        const container = document.createElement("input");
        const handlers = {};
        const data = [{ ok: 1 }];

        setProperty(container, "_key", null, data, false, handlers);

        expect(container.getAttribute("_key")).to.equal(null);
        expect(container._key).to.equal(undefined);
    });

    it("setProperty# on ", () => {
        const container = document.createElement("input");
        const handlers = {};

        setProperty(container, "onclick", () => {}, false, false, handlers);
    });
});
