import { expect } from "@esm-bundle/chai";
import { renderChildren } from "../render.js";
import { html } from "../../html.js";
/**
 * @param {import("vnode").Fragment} fragment
 * @returns {Node[]}
 */
const fragmentToChildNodes = ({ markStart, markEnd }) => {
    let list = [];
    let currentNode = markStart;
    while ((currentNode = currentNode.nextSibling) && currentNode != markEnd)
        list.push(currentNode);
    return list;
};
/**
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
/**
 * @param {number} size
 * @returns {number[]}
 */
function randomList(size) {
    let list = [];
    while (true) {
        if (list.length < size) {
            const i = random(1, size);
            if (!list.includes(i)) list.push(i);
        } else {
            return list;
        }
    }
}

describe("src/render#children", () => {
    it("Escape from objects", () => {
        const root = document.createElement("div");
        const ref = {};
        const children = [{}, {}, [{}], html`<span ref=${ref} />`];
        const id = Symbol("id");
        const fragment = renderChildren(children, null, root, id, false);
        const childNodes = fragmentToChildNodes(fragment);
        expect(childNodes).to.deep.equal([ref.current]);
    });
    it("Render: Size", () => {
        const root = document.createElement("div");
        const children = [...Array(10)].map(() => html`<span></span>`);
        const id = Symbol("id");
        const fragment = renderChildren(children, null, root, id, false);
        const childNodes = fragmentToChildNodes(fragment);
        expect(childNodes.length).to.equal(children.length);
    });
    it("nested lists", () => {
        const root = document.createElement("div");
        const id = Symbol("id");
        let count = 0;
        const list = [...Array(10)].map((_, index) => {
            const list = [...Array(5)].map(
                () => html`<span data-id=${count++} />`,
            );
            return index % 2 ? list : [list];
        });
        const fragment = renderChildren(list, null, root, id);
        const flat = (value) =>
            Array.isArray(value) ? value.flatMap(flat) : value;
        const childNodes = fragmentToChildNodes(fragment);
        const listFlat = list.flatMap(flat);
        expect(childNodes.length).to.equal(listFlat.length);
        childNodes.forEach((child, index) =>
            expect(Number(child.dataset.id)).to.equal(index),
        );
    });
    it("Render: Simple list rendering", () => {
        const root = document.createElement("div");
        const id = Symbol("id");
        let fragment;
        /**
         * @param {number} size
         */
        let update = (size) => {
            let list = [...Array(size)];
            fragment = renderChildren(
                list.map(
                    (_, index) =>
                        html`<span data-id="${index}">${index}</span>`,
                ),
                fragment,
                root,
                id,
                false,
            );
            const childNodes = fragmentToChildNodes(fragment);
            expect(childNodes.length).to.equal(list.length);
            expect(
                childNodes.every(
                    (child, index) => child.dataset.id == `${index}`,
                ),
            ).to.true;
        };
        update(66);
        update(10);
        update(0);
        update(11);
        update(33);
    });

    it("Render: Simple list rendering with keyes", () => {
        const id = Symbol("id");
        const host = document.createElement("div");
        let size = 100;
        let fragment;

        while (size--) {
            const list = randomList(random(0, size));
            fragment = renderChildren(
                list.map(
                    (key) => html`<span data-key=${key} key=${key}></span>`,
                ),
                fragment,
                host,
                id,
            );
            const childNodes = fragmentToChildNodes(fragment);
            expect(childNodes.length).to.equal(list.length);
            childNodes.forEach((child, index) =>
                expect(Number(child.dataset.key)).to.equal(list[index]),
            );
        }
    });
});
