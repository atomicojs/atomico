import { h, render, useContext, createContext } from "../src/index";
import { container } from "./util";

let Context = createContext({ title: "Atomico!" });

describe("test with useContext", () => {
    it("get context", () => {
        let scope = container();

        function Test(props, context) {
            let { title } = useContext(Context);

            assert.equal(title, "Atomico!");
        }

        render(
            <Context.Provider>
                <Test />
            </Context.Provider>,
            scope
        );
    });
    it("update context", () => {
        let scope = container();

        function Child() {
            let { title } = useContext(Context);
            assert.equal(title, "Atomico awesome!");
        }

        function Test() {
            return (
                <Context.Provider value={{ title: "Atomico awesome!" }}>
                    <Child />
                </Context.Provider>
            );
        }

        render(<Test />, scope);
    });
    it("use Consumer", () => {
        let scope = container();

        function Child() {
            return (
                <Context.Consumer>
                    {({ title }) => {
                        assert.equal(title, "Atomico awesome!");
                    }}
                </Context.Consumer>
            );
        }

        function Test() {
            return (
                <Context.Provider value={{ title: "Atomico awesome!" }}>
                    <Child />
                </Context.Provider>
            );
        }

        render(<Test />, scope);
    });
});
