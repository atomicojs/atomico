import { h, render } from "../src/index";
import { container, createList } from "./util";

function TestList(props) {
    return (
        <div ref={props.ref}>
            {props.list.map(data => (
                <button
                    key={props.witKeys ? data.key : undefined}
                    id={data.key}
                >
                    {data.key}
                </button>
            ))}
        </div>
    );
}

describe("simple list", () => {
    it("create 10", () => {
        let scope = container(),
            length = 10,
            ref = {},
            list = createList(length);

        render(<TestList ref={ref} list={list} />, scope);

        assert.equal(ref.current.querySelectorAll("button[id]").length, length);
    });
    it("create 10 and remove 10", () => {
        let scope = container(),
            ref = {},
            list = createList(10);

        render(<TestList ref={ref} list={list} />, scope);
        render(<TestList list={[]} />, scope);

        assert.equal(ref.current.querySelectorAll("button[id]").length, 0);
    });

    it("create 10 and remove 5", () => {
        let scope = container(),
            ref = {},
            list1 = createList(10),
            list2 = createList(5);

        render(<TestList ref={ref} list={list1} />, scope);
        render(<TestList list={list2} />, scope);

        assert.equal(ref.current.querySelectorAll("button[id]").length, 5);
    });
});
