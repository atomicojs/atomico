import { h, render } from "../../core/core";

describe("set-attribute", () => {
    it("basic", async () => {
        let node = document.createElement("div");

        let attrs = {
            class: "className",
            id: "id",
            "data-set": "data-set",
            "any-attr": "any-attr"
        };

        render(<host {...attrs}></host>, node);

        for (let key in attrs) {
            expect(node.getAttribute(key)).toBe(attrs[key]);
        }
    });

    it("set attribute object", async () => {
        let node = document.createElement("div");

        let example = { name: "any" };

        render(<host example={example}></host>, node);

        expect(node.getAttribute("example")).toBe(JSON.stringify(example));
    });
});
