import { h, useRef } from "../../core/core";
import { customElementScope } from "../utils";

describe("useRef", () => {
    it("current ref", async () => {
        let instances = [];

        function Wc() {
            let ref = useRef();
            instances.push(ref);
            return <host ref={ref} />;
        }

        let node = customElementScope(Wc);

        document.body.appendChild(node);

        await node.updated;

        expect(instances[0].current).toBe(node);

        node.update();

        await node.updated;

        expect(
            instances.every((instance) => instance === instances[0])
        ).toBeTruthy();

        expect(instances.length).toBe(2);
    });
});
