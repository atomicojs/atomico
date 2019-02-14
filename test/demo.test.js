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

describe("Lifecycle", () => {
    it("...", () => {
        let scope = container(),
            error = 0;
        function regenerate(length) {
            let list1 = createList(length),
                list2 = randomList(createList(length));

            render(h(TestList, { list: list1, witKeys: true }), scope);

            let nodeList1 = scope.querySelectorAll("button"),
                mapKeys1 = createMapKeys(nodeList1);

            render(h(TestList, { list: list2, witKeys: true }), scope);

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
