import { expect } from "@esm-bundle/chai";
import { useRef } from "../hooks/create-hooks";
import { customElementScope } from "./element.test.js";
import { html } from "../../html.js";

describe("Element with hooks", () => {
    it("useRef", async () => {
        let ref;

        function a() {
            ref = useRef();
            return html`<host ref=${ref} />`;
        }

        const node = customElementScope(a);

        document.body.appendChild(node);

        await node.updated;

        expect(ref.current).to.an.instanceOf(node.constructor);
    });
});
