import { expect } from "@esm-bundle/chai";
import { serialize, checkIncompatibility, toCss } from "../utils";

describe("utils", () => {
    it("serialize", () => {
        expect(serialize(true && "1", true && "2", true && "3")).to.equal(
            "1 2 3",
        );

        expect(serialize(false && "1", true && "2", true && "3")).to.equal(
            "2 3",
        );

        expect(serialize(false && "1", true && "2", false && "3")).to.equal(
            "2",
        );
    });
    it("checkIncompatibility", () => {
        expect(checkIncompatibility()).to.instanceOf(Array);
        expect(checkIncompatibility().length).to.equal(0);
    });
    it("toCss", () => {
        const extract = (s) => Object.values(s.cssRules).map((v) => v.cssText);
        let styleSheet = toCss({
            ":host": {
                width: 696,
                height: 100,
                flex: 1,
            },
            ".root": {
                fontSize: 12,
                lineHeight: 1.5,
            },
        });
        expect(extract(styleSheet)).to.eql([
            ":host { width: 696px; height: 100px; flex: 1 1 0%; }",
            ".root { font-size: 12px; line-height: 1.5; }",
        ]);
        styleSheet = toCss("https://unpkg.com/open-props");
        expect(extract(styleSheet)).to.have.length.gt(1);
    });
});
