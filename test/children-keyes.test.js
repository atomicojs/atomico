import { h, render } from "../src/index";
import { KEY } from "../src/constants";
import { container, createList, randomList } from "./util";

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

function createMapKeys(nodeList) {
    let keys = {};
    for (let i = 0; i < nodeList.length; i++) {
        let child = nodeList[i];
        keys[child[KEY]] = child;
    }
    return keys;
}

describe("simple list keys", () => {
    it("create 10", () => {
        let scope = container(),
            length = 10,
            ref = {},
            list = createList(length);

        render(<TestList ref={ref} list={list} witKeys />, scope);

        assert.equal(ref.current.querySelectorAll("button[id]").length, length);
    });
    it("create 10 and remove 10", () => {
        let scope = container(),
            ref = {},
            list = createList(10);

        render(<TestList ref={ref} list={list} witKeys />, scope);
        render(<TestList list={[]} witKeys />, scope);

        assert.equal(ref.current.querySelectorAll("button[id]").length, 0);
    });

    it("create 10 and remove 5", () => {
        let scope = container(),
            ref = {},
            list1 = createList(10),
            list2 = createList(5);

        render(<TestList ref={ref} list={list1} witKeys />, scope);
        render(<TestList list={list2} witKeys />, scope);

        assert.equal(ref.current.querySelectorAll("button[id]").length, 5);
    });

    it("scale random list", () => {
        let scope = container(),
            error = 0;
        function regenerate(length) {
            let list1 = createList(length),
                list2 = randomList(createList(length));

            render(<TestList list={list1} witKeys />, scope);

            let nodeList1 = scope.querySelectorAll("button"),
                mapKeys1 = createMapKeys(nodeList1);

            render(<TestList list={list2} witKeys />, scope);

            let nodeList2 = scope.querySelectorAll("button"),
                mapKeys2 = createMapKeys(nodeList2);

            list2.map(({ key }, index) => {
                if (String(nodeList2[index].id) !== String(key)) error++;
            });

            for (let key in mapKeys1) {
                if (mapKeys1[key] !== mapKeys2[key]) error++;
            }
        }
        for (let i = 0; i < 100; i++) {
            regenerate(100);
        }
        assert.equal(error, 0);
    });
});
