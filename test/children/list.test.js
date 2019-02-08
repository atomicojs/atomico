import { container, createList } from "../util";
import { h, render, useMemo } from "../../dist/atomico";

describe("simple list", () => {
    test("create 10", () => {
        let scope = container(),
            length = 10;
        function Test(props) {
            let list = createList(length);
            return (
                <div ref={props.ref}>
                    {list.map(props => (
                        <button id={props.key}>{props.key}</button>
                    ))}
                </div>
            );
        }
        let ref = {};
        render(<Test ref={ref} />, scope);

        expect(ref.current.querySelectorAll("button[id]").length).toBe(length);
    });
    test("create 10 and remove 10", () => {
        let scope = container();

        function Test(props) {
            let list = createList(props.length);
            return (
                <div ref={props.ref}>
                    {list.map(props => (
                        <button id={props.key}>{props.key}</button>
                    ))}
                </div>
            );
        }
        let ref = {};

        render(<Test ref={ref} length={10} />, scope);
        render(<Test length={0} />, scope);

        expect(ref.current.querySelectorAll("button[id]").length).toBe(0);
    });
    test("create 10 and remove 5", () => {
        let scope = container();

        function Test(props) {
            let list = createList(props.length);
            return (
                <div ref={props.ref}>
                    {list.map(props => (
                        <button id={props.key}>{props.key}</button>
                    ))}
                </div>
            );
        }
        let ref = {};

        render(<Test ref={ref} length={10} />, scope);
        render(<Test length={5} />, scope);

        expect(ref.current.querySelectorAll("button[id]").length).toBe(5);
    });
});
