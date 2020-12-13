import { expect } from "@esm-bundle/chai";
import { saniateValue, saniate, createSheet } from "../utils.js";

describe("css/css", () => {
    it("saniateValue function", () => {
        expect(saniateValue(console.log)).to.equal("");
    });
    it("saniateValue object", () => {
        expect(saniateValue([])).to.equal("");
    });
    it("saniateValue array", () => {
        expect(saniateValue({})).to.equal("");
    });
    it("saniate concat", () => {
        expect(saniate(["html"], ["content"])).to.equal("htmlcontent");
    });
    it("saniate clear", () => {
        expect(saniate(["html"], [console.log])).to.equal("html");
    });
    it("createSheet", () => {
        expect(createSheet(":host{}")).instanceOf(CSSStyleSheet);
    });
});
