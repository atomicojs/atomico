import { h, useProp } from "../../core/core";
import { customElementScope } from "../utils";

describe("useProp", () => {
    it("get value from property", async () => {
        let defaultValue = "Atomico!";
        function Wc() {
            let [sample] = useProp("sample");
            expect(sample).toBe(defaultValue);
            return <host />;
        }

        Wc.props = {
            sample: {
                type: String,
                value: defaultValue
            }
        };

        let node = customElementScope(Wc);

        document.body.appendChild(node);

        await node.rendered;

        node.sample = defaultValue = defaultValue + defaultValue;

        await node.rendered;
    });
});
