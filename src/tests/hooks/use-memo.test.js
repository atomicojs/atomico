import { h, useMemo } from "../../core/core";
import { customElementScope, delay } from "../utils";

describe("useMemo", () => {
    it("recall", async () => {
        // returns to map by useMemo
        let values = {
            1: "a",
            2: "b",
            3: "c"
        };
        // useMemo returns results
        let res = {};
        // number of times called useMemo
        let recall = 0;

        function Wc({ value }) {
            let data = useMemo(() => {
                recall++;
                return values[value];
            }, [value]);

            res[value] = data;
            return <host />;
        }

        Wc.props = { value: { type: Number, value: 1 }, cycle: Number };

        let node = customElementScope(Wc);

        document.body.appendChild(node);

        await node.rendered;

        let increment = (value = 0) => value + 1;

        node.value = increment;

        await node.rendered;

        // synthetically cycle increases the number of render

        node.cycle = increment;

        await node.rendered;

        node.value = increment;

        await node.rendered;

        node.cycle = increment;

        await node.rendered;

        expect(recall).toBe(3);

        expect(values).toEqual(res);
    });
});
