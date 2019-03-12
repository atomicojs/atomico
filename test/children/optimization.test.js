import { container, createList } from "../util";
import { h, render } from "../../dist/atomico";

describe("optimization test in children", () => {
    let children = createList(10).map(({ key }) => <button>{key}</button>);
    test("ignore update by inheritance of children", () => {
        let scope = container(),
            rerenderCount = 0;

        function Test() {
            rerenderCount++;
        }

        render(<Test>{children}</Test>, scope);
        render(<Test>{children}</Test>, scope);
        render(<Test>{children}</Test>, scope);

        expect(rerenderCount).toBe(1);
    });

    test("ignore update due to non-mutation of properties", () => {
        let scope = container(),
            rerenderCount = 0;

        function Test() {
            rerenderCount++;
        }

        render(<Test id="10" />, scope);
        render(<Test id="10" />, scope);
        render(<Test id="10" />, scope);

        expect(rerenderCount).toBe(1);
    });
});
