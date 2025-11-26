import { describe, expect, it } from "vitest";
import { c } from "../../core.js";
import { live } from "../../tests/element.test.js";
import { useAsync } from "../custom-hooks.js";
import { delay } from "./utils.js";

describe("useAsync", () => {
    it("simple", async () => {
        const result = [];
        const Component = c(() => {
            result.push(useAsync(() => delay(100, { id: 0 }), []));
            return <host></host>;
        });

        live(Component);

        await delay();

        expect(result).toEqual([{ id: 0 }]);
    });
});
