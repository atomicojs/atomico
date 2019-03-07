import { container } from "../util";
import { h, render, createContext, useContext } from "../../src";

describe("test context", () => {
    let defaultValue = "with context",
        Context = createContext(defaultValue);

    test("useContext default value", () => {
        let scope = container();
        function Test() {
            expect(useContext(Context)).toBe(defaultValue);
        }

        render(<Test />, scope);
    });

    test("useContext from provider", () => {
        let scope = container(),
            value = "from provider";

        function Test() {
            expect(useContext(Context)).toBe(value);
        }

        render(
            <Context.Provider value={value}>
                <Test />
            </Context.Provider>,
            scope
        );
    });

    test("Consumer default value", () => {
        let scope = container();

        function Test() {
            return (
                <Context.Consumer>
                    {currentValue => {
                        expect(currentValue).toBe(defaultValue);
                    }}
                </Context.Consumer>
            );
        }

        render(<Test />, scope);
    });
    return;

    test("Consumer from provider", () => {
        let scope = container(),
            value = "from provider";

        function Test() {
            return (
                <Context.Consumer>
                    {currentValue => {
                        expect(currentValue).toBe(value);
                    }}
                </Context.Consumer>
            );
        }

        render(
            <Context.Provider value={value}>
                <Test />
            </Context.Provider>,
            scope
        );
    });
});
