import { expect, describe, it } from "vitest";
import { renderChildren } from "../render.js";
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
 *
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
/**
 *
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

        const ref: { current?: Element } = {};
        const children = [{}, {}, [{}], <span ref={ref} />];
        const id = Symbol();
        const fragment = renderChildren(children, null, root, id, false);
        const childNodes = fragmentToChildNodes(fragment);
        expect(childNodes).toEqual([ref.current]);
    });
    it("Render: Size", () => {
        const root = document.createElement("div");
        const children = [...Array(10)].map((_, id) => <span></span>);
        const id = Symbol();
        const fragment = renderChildren(children, null, root, id, false);
        const childNodes = fragmentToChildNodes(fragment);
        expect(childNodes.length).toEqual(children.length);
    });
    it("nested lists", () => {
        const root = document.createElement("div");
        const id = Symbol();
        let count = 0;
        const list = [...Array(10)].map((_, index) => {
            const list = [...Array(5)].map(() => <span data-id={count++} />);
            return index % 2 ? list : [list];
        });
        const fragment = renderChildren(list, null, root, id);
        const flat = (value) =>
            Array.isArray(value) ? value.flatMap(flat) : value;
        const childNodes = fragmentToChildNodes(fragment);
        const listFlat = list.flatMap(flat);
        expect(childNodes.length).toEqual(listFlat.length);
        childNodes.forEach((child, index) =>
            // @ts-ignore
            expect(Number(child.dataset.id)).toEqual(index)
        );
    });
    it("Render: Simple list rendering", () => {
        const root = document.createElement("div");
        const id = Symbol();
        let fragment;
        /**
         *
         * @param {number} size
         */
        let update = (size) => {
            let list = [...Array(size)];
            fragment = renderChildren(
                list.map((_, index) => <span data-id={index}>${index}</span>),
                fragment,
                root,
                id,
                false
            );
            const childNodes = fragmentToChildNodes(fragment);
            expect(childNodes.length).toEqual(list.length);
            expect(
                childNodes.every(
                    // @ts-ignore
                    (child, index) => child.dataset.id == index + ""
                )
            ).to.true;
        };
        update(66);
        update(10);
        update(0);
        update(11);
        update(33);
    });

    it("Render: Simple list rendering with keyes", () => {
        const id = Symbol();
        const host = document.createElement("div");
        let size = 100;
        let fragment;

        while (size--) {
            const list = randomList(random(0, size));
            fragment = renderChildren(
                list.map((key) => <span data-key={key} key={key}></span>),
                fragment,
                host,
                id
            );
            const childNodes = fragmentToChildNodes(fragment);
            expect(childNodes.length).toEqual(list.length);
            childNodes.forEach((child, index) =>
                expect(Number(child.dataset.key)).toEqual(list[index])
            );
        }
    });
});
