import { container, createList, loading } from "../util";
import { h, render } from "../../dist/atomico";
import TestList from "./TestList";

describe("simple list", () => {
    test("create 10", () => {
        let scope = container(),
            length = 10,
            ref = {};

        render(<TestList ref={ref} list={createList(length)} />, scope);

        expect(ref.current.querySelectorAll("button").length).toBe(length);
    });
    test("create 10 and remove 10", () => {
        let scope = container(),
            ref = {};

        render(<TestList ref={ref} list={createList(10)} />, scope);
        render(<TestList list={[]} />, scope);

        expect(ref.current.querySelectorAll("button").length).toBe(0);
    });
    test("create 10 and remove 5", () => {
        let scope = container(),
            ref = {};

        render(<TestList ref={ref} list={createList(10)} />, scope);
        render(<TestList list={createList(5)} />, scope);

        expect(ref.current.querySelectorAll("button").length).toBe(5);
    });
});
