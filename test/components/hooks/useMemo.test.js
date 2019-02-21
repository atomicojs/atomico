import { container } from "../../util";
import { h, render, useEffect, useMemo } from "../../../src";

describe("test useMemo", () => {
    test("without execution", () => {
        let scope = container(),
            executionCounter = 0;

        function Test() {
            let data = useMemo(() => {
                executionCounter++;
                return [];
            }, []);
        }

        for (let i = 0; i < 10; i++) {
            render(<Test id={i} />, scope);
        }
        expect(executionCounter).toBe(1);
    });
});
