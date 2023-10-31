import { expect } from "@esm-bundle/chai";
import { serialize, checkIncompatibility } from "../utils.js";

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
});
