import { container, createList, randomList, randomInsert } from "../util";
import { h, render } from "../../src";
import TestList from "./TestList";

function createMapKeys(nodeList) {
	let keys = {};
	for (let i = 0; i < nodeList.length; i++) {
		let child = nodeList[i];
		keys[child.dataset.key] = child;
	}
	return keys;
}

describe("simple list keys", () => {
	test("create 10", () => {
		let scope = container(),
			length = 10,
			ref = {},
			list = createList(length);

		render(<TestList witKeys ref={ref} list={list} />, scope);

		expect(ref.current.querySelectorAll("button").length).toBe(length);
	});
	test("create 10 and remove 10", () => {
		let scope = container(),
			ref = {},
			list = createList(10);

		render(<TestList witKeys ref={ref} list={list} />, scope);
		render(<TestList witKeys list={[]} />, scope);

		expect(ref.current.querySelectorAll("button").length).toBe(0);
	});
	test("create 10 and remove 5", () => {
		let scope = container(),
			ref = {},
			list1 = createList(10),
			list2 = createList(5);

		render(<TestList witKeys ref={ref} list={list1} />, scope);
		render(<TestList witKeys list={list2} />, scope);

		expect(ref.current.querySelectorAll("button").length).toBe(5);
	});
});
/**
 * the following test generates different order scenarios checking
 * from 1 to 100 children, incrementally or not, keeping the same father
 */
describe("complex", () => {
	test("incremental reordering, even and odd", () => {
		let scope = container();
		function generate(length) {
			let list = createList(length);

			render(list.map(({ key }) => <span key={key} />), scope);

			let childrenBefore = { ...scope.children };

			list = randomList(list);

			render(list.map(({ key }) => <span key={key} />), scope);

			let childrenAfter = [...scope.children];

			return childrenAfter.reduce((fail, child, index) => {
				let key = child.dataset.key;
				if (child != childrenBefore[key]) {
					fail++;
				}
				if (list[index].key != key) {
					fail++;
				}
				return fail;
			}, 0);
		}
		let total = 0;
		for (let i = 0; i < 100; i++) {
			total += generate(i);
		}
		for (let i = 100; i; i--) {
			total += generate(i);
		}
		expect(total).toBe(0);
	});
	test("incremental reordering, even, odd and random", () => {
		let scope = container();
		function generate(length) {
			let list = createList(length);

			render(list.map(({ key }) => <span key={key} />), scope);

			let mapKeys = { ...list };

			let childrenBefore = { ...scope.children };

			list = randomInsert(randomList(list), 2);

			render(list.map(({ key }) => <span key={key} />), scope);

			let childrenAfter = [...scope.children];

			return childrenAfter.reduce((fail, child, index) => {
				let key = child.dataset.key;
				if (key in mapKeys && child != childrenBefore[key]) {
					fail++;
				}
				if (list[index].key != key) {
					fail++;
				}
				return fail;
			}, 0);
		}
		let total = 0;
		for (let i = 0; i < 100; i++) {
			total += generate(i);
		}
		for (let i = 100; i; i--) {
			total += generate(i);
		}
		expect(total).toBe(0);
	});
});
