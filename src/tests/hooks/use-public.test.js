import { h, usePublic } from "../../core/core";
import { customElementScope } from "../utils";

describe("usePublic", () => {
    it("define from render a public element to the web-component", async () => {
        let defaultValue = "Atomico!";

        let field = "any";

        function Wc() {
            usePublic(field, defaultValue);
            return <host />;
        }

        let node = customElementScope(Wc);

        document.body.appendChild(node);

        await node.rendered;

        expect(node[field]).toBe(defaultValue);
    });
});
