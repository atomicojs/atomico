//@ts-ignore
import { expect } from "@bundled-es-modules/chai";
import { render } from "../render.js";
import html from "../../html/html";

describe("src/render#children", () => {
    let createRandomList = (max, list = [], min = 0) => {
        let addValues = () => {
            if (list.length < max) {
                let value = Math.floor(Math.random() * (max - min)) + min;
                if (!list.includes(value)) {
                    list.push(value);
                }
                addValues();
            }
            return list;
        };
        return addValues();
    };

    it("Render: Simple list rendering", () => {
        let div = document.createElement("div");
        let update = (size) => {
            let list = [...Array(size)];
            render(
                html`<host>
                    ${list.map(
                        (_, index) =>
                            html`<span data-id="${index}">${index}</span>`
                    )}
                </host>`,
                div
            );

            let children = [...div.querySelectorAll(":scope > span[data-id]")];

            if (children == null) {
                children = [];
            }

            expect(children.length).to.equal(list.length);

            children.forEach((el, index) =>
                expect(el.getAttribute("data-id")).to.equal(index + "")
            );
        };
        update(66);
        update(10);
        update(0);
        update(11);
        update(33);
    });

    it("Render: Simple list rendering with keyes", () => {
        let div = document.createElement("div");
        let update = (size) => {
            let ref_1 = {};
            let list = createRandomList(size);
            let createRef = (ref, index) => (ref[index] = ref[index] || {});
            render(
                html`<host>
                    ${list.map(
                        (index) => html`<span
                            key="${index}"
                            data-key="${index}"
                            ref="${createRef(ref_1, index)}"
                        >
                            ${index}
                        </span>`
                    )}
                </host>`,
                div
            );

            let children = [...div.querySelectorAll(":scope > span")];

            list.forEach((key, i) => {
                expect(Number(children[i].getAttribute("data-key"))).to.equal(
                    key
                );
            });

            list.reverse();

            let ref_2 = {};

            render(
                html`<host>
                    ${list.map(
                        (index) =>
                            html`<span
                                key="${index}"
                                data-key="${index}"
                                ref="${createRef(ref_2, index)}"
                            >
                                ${index}
                            </span>`
                    )}
                </host>`,
                div
            );

            children = [...div.querySelectorAll(":scope > span")];

            list.forEach((key, i) => {
                expect(Number(children[i].getAttribute("data-key"))).to.equal(
                    key
                );
            });

            for (let key in ref_1) {
                expect(ref_1[key].current).to.equal(ref_2[key].current);
            }
        };
        update(10);
    });
});
