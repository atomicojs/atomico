import { expect, describe, it } from "vitest";
import { renderChildren } from "../render.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns all real child nodes between the two marks of a fragment.
 * @param {import("vnode").Fragment} fragment
 * @returns {ChildNode[]}
 */
const fragmentChildren = ({ markStart, markEnd }) => {
    const list = [];
    let node = markStart;
    while ((node = node.nextSibling) && node !== markEnd) list.push(node);
    return list;
};

/**
 * Counts DOM mutations (childList) produced by a callback.
 * Calls takeRecords() before disconnecting to flush any pending microtask records.
 * @param {Element} root
 * @param {() => void} fn
 * @returns {{ added: number, removed: number }}
 */
function countMutations(root, fn) {
    const records = [];
    const observer = new MutationObserver((list) => records.push(...list));
    observer.observe(root, { childList: true, subtree: false });
    fn();
    // Flush pending records before disconnecting
    records.push(...observer.takeRecords());
    observer.disconnect();
    let added = 0, removed = 0;
    for (const r of records) {
        added += r.addedNodes.length;
        removed += r.removedNodes.length;
    }
    return { added, removed };
}

/**
 * Generates a shuffled array of numbers 1..size.
 * @param {number} size
 * @returns {number[]}
 */
function shuffled(size) {
    const arr = Array.from({ length: size }, (_, i) => i + 1);
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ─── Basic correctness ───────────────────────────────────────────────────────

describe("renderChildren — basic correctness", () => {
    it("maps null, boolean and undefined to empty strings, escaping only functions", () => {
        /**
         * flat() maps null, booleans and undefined to empty strings for unkeyed lists
         * to preserve positioning. Functions are still skipped entirely.
         *
         * Before: [null, false, true, () => {}, [null, [false]], <span />]
         * After:  [Text(""), Text(""), Text(""), Text(""), Text(""), <span />]
         * Output: 6 nodes
         */
        const root = document.createElement("div");
        const ref: { current?: Element } = {};
        const children = [null, false, true, () => {}, [null, [false]], <span ref={ref} />];
        const id = Symbol();
        const fragment = renderChildren(children, null, root, id, false);
        const childNodes = fragmentChildren(fragment);
        expect(childNodes.length).toBe(6);
        expect(childNodes[5]).toBe(ref.current);
    });

    it("renders the correct number of nodes", () => {
        /**
         * A flat list of vnodes produces exactly that many child nodes in the DOM.
         *
         * Before: (empty)
         * After:  [<span/>, <span/>, ...×10]
         * Output: 10 nodes
         */
        const root = document.createElement("div");
        const id = Symbol();
        const children = Array.from({ length: 10 }, () => <span />);
        const fragment = renderChildren(children, null, root, id, false);
        expect(fragmentChildren(fragment).length).toBe(10);
    });

    it("renders nested arrays (deep flatten)", () => {
        /**
         * Children can be arbitrarily nested arrays — flat() traverses them all.
         * Every vnode is rendered in source order regardless of nesting depth.
         *
         * Before: (empty)
         * After:  [[<span 0/>, <span 1/>], [[<span 2/>, ...]], ...]
         * Output: 50 nodes in order data-id=0..49
         */
        const root = document.createElement("div");
        const id = Symbol();
        let count = 0;
        const list = Array.from({ length: 10 }, (_, i) => {
            const inner = Array.from({ length: 5 }, () => <span data-id={count++} />);
            return i % 2 ? inner : [inner];
        });
        const fragment = renderChildren(list, null, root, id);
        const nodes = fragmentChildren(fragment);
        const deepFlat = (v) => Array.isArray(v) ? v.flatMap(deepFlat) : v;
        expect(nodes.length).toBe(list.flatMap(deepFlat).length);
        nodes.forEach((node, i) =>
            // @ts-ignore
            expect(Number(node.dataset.id)).toBe(i)
        );
    });

    it("handles null children — container stays empty", () => {
        /**
         * Passing null as children is valid and produces no DOM nodes.
         * Used when a component conditionally renders nothing.
         *
         * Before: (empty)
         * After:  null
         * Output: 0 nodes
         */
        const root = document.createElement("div");
        renderChildren(null, null, root, Symbol(), false);
        expect(root.children.length).toBe(0);
    });

    it("handles a single non-array child", () => {
        /**
         * A single vnode (not wrapped in an array) is normalized internally
         * and rendered as one child node.
         *
         * Before: (empty)
         * After:  <span />     (not [<span />])
         * Output: 1 node
         */
        const root = document.createElement("div");
        const id = Symbol();
        const fragment = renderChildren(<span />, null, root, id, false);
        expect(fragmentChildren(fragment).length).toBe(1);
    });

    it("renders text nodes", () => {
        /**
         * String children produce a Text node in the DOM.
         *
         * Before: (empty)
         * After:  ["hello"]
         * Output: Text("hello")
         */
        const root = document.createElement("div");
        const id = Symbol();
        const fragment = renderChildren(["hello"], null, root, id, false);
        expect(root.textContent).toContain("hello");
        expect(fragmentChildren(fragment)[0]).toBeInstanceOf(Text);
    });

    it("concatenates adjacent text/number siblings into one Text node", () => {
        /**
         * flat() merges consecutive strings/numbers into a single string
         * before the reconciler runs, so they land as ONE Text node.
         * This avoids unnecessary extra Text nodes in the DOM.
         *
         * Before: (empty)
         * After:  ["a", "b", 3]
         * Output: Text("ab3")  — 1 node, not 3
         */
        const root = document.createElement("div");
        const id = Symbol();
        const fragment = renderChildren(["a", "b", 3], null, root, id, false);
        const nodes = fragmentChildren(fragment);
        expect(nodes.length).toBe(1);
        expect(nodes[0].textContent).toBe("ab3");
    });
});

// ─── Node identity (no unnecessary DOM mutations) ────────────────────────────

describe("renderChildren — node identity & minimal mutations", () => {
    it("reuses the same Text node when content is unchanged", () => {
        /**
         * Re-rendering an identical string produces zero DOM mutations.
         * The existing Text node reference stays the same.
         *
         * Before: <>hello</>
         * After:  <>hello</>
         * Output: same Text node, added=0, removed=0
         */
        const root = document.createElement("div");
        const id = Symbol();
        const f1 = renderChildren(["hello"], null, root, id, false);
        const textNode = fragmentChildren(f1)[0];

        const { added, removed } = countMutations(root, () => {
            renderChildren(["hello"], f1, root, id, false);
        });

        expect(fragmentChildren(f1)[0]).toBe(textNode);
        expect(added).toBe(0);
        expect(removed).toBe(0);
    });

    it("mutates text content in-place instead of replacing the node", () => {
        /**
         * When text content changes, the existing Text node's .data is updated
         * directly — no insertBefore/removeChild, zero childList mutations.
         *
         * Before: <>before</>
         * After:  <>after</>
         * Output: same Text node with .data="after", added=0, removed=0
         */
        const root = document.createElement("div");
        const id = Symbol();
        const f1 = renderChildren(["before"], null, root, id, false);
        const textNode = fragmentChildren(f1)[0];

        const { added, removed } = countMutations(root, () => {
            renderChildren(["after"], f1, root, id, false);
        });

        expect(fragmentChildren(f1)[0]).toBe(textNode);
        expect(textNode.textContent).toBe("after");
        expect(added).toBe(0);
        expect(removed).toBe(0);
    });

    it("reuses element nodes when type is unchanged", () => {
        /**
         * When the vnode type matches the existing element, the same DOM node
         * is reused and only its attributes are patched. No re-creation.
         *
         * Before: <span id="a" />
         * After:  <span id="b" />
         * Output: same <span> element, id="b"
         */
        const root = document.createElement("div");
        const id = Symbol();
        const f1 = renderChildren([<span id="a" />], null, root, id, false);
        const spanNode = fragmentChildren(f1)[0];

        renderChildren([<span id="b" />], f1, root, id, false);

        expect(fragmentChildren(f1)[0]).toBe(spanNode);
        // @ts-ignore
        expect(spanNode.id).toBe("b");
    });

    it("replaces element when type changes (span → h1)", () => {
        /**
         * When the vnode type changes, the old node must be replaced.
         * This is the only case where a new node enters and an old one leaves.
         *
         * Before: <span />
         * After:  <h1 />
         * Output: <h1> in DOM, added≥1, removed≥1
         */
        const root = document.createElement("div");
        const id = Symbol();
        const f1 = renderChildren([<span />], null, root, id, false);

        const { added, removed } = countMutations(root, () => {
            renderChildren([<h1 />], f1, root, id, false);
        });

        expect(root.innerHTML).toContain("<h1>");
        expect(added).toBeGreaterThanOrEqual(1);
        expect(removed).toBeGreaterThanOrEqual(1);
    });

    it("produces zero mutations when re-rendering identical vnode list", () => {
        /**
         * If render() detects that the stored vnode reference hasn't changed
         * (same object), it bails out early — no DOM writes at all.
         *
         * Before: <span/> ×5
         * After:  same vnode objects (===)
         * Output: added=0, removed=0
         */
        const root = document.createElement("div");
        const id = Symbol();
        const items = Array.from({ length: 5 }, (_, i) => <span data-i={i} />);
        const f1 = renderChildren(items, null, root, id, false);

        const { added, removed } = countMutations(root, () => {
            renderChildren(items, f1, root, id, false);
        });

        expect(added).toBe(0);
        expect(removed).toBe(0);
    });

    it("removes excess nodes when list shrinks — no extra mutations", () => {
        /**
         * When the list shrinks, only the surplus nodes are removed.
         * No new nodes are inserted; the remaining 3 are reused in place.
         *
         * Before: <span/> ×10
         * After:  <span/> ×3
         * Output: 3 nodes remain, removed≥7
         */
        const root = document.createElement("div");
        const id = Symbol();
        const big = Array.from({ length: 10 }, (_, i) => <span data-i={i} />);
        const f1 = renderChildren(big, null, root, id, false);

        const { removed } = countMutations(root, () => {
            const small = Array.from({ length: 3 }, (_, i) => <span data-i={i} />);
            renderChildren(small, f1, root, id, false);
        });

        expect(fragmentChildren(f1).length).toBe(3);
        expect(removed).toBeGreaterThanOrEqual(7);
    });

    it("adds only new nodes when list grows", () => {
        /**
         * When the list grows, only the new trailing nodes are inserted.
         * The existing 3 nodes are reused with their props patched in place.
         *
         * Before: <span/> ×3
         * After:  <span/> ×8
         * Output: 8 nodes, added≥5 (the 5 new ones)
         */
        const root = document.createElement("div");
        const id = Symbol();
        const small = Array.from({ length: 3 }, (_, i) => <span data-i={i} />);
        const f1 = renderChildren(small, null, root, id, false);

        const { added } = countMutations(root, () => {
            const big = Array.from({ length: 8 }, (_, i) => <span data-i={i} />);
            renderChildren(big, f1, root, id, false);
        });

        expect(fragmentChildren(f1).length).toBe(8);
        expect(added).toBeGreaterThanOrEqual(5);
    });
});

// ─── Keyed reconciliation ────────────────────────────────────────────────────

describe("renderChildren — keyed reconciliation", () => {
    it("preserves node identity when keyed list order is unchanged", () => {
        /**
         * When the same keys appear in the same order, no DOM moves happen.
         * Every node reference stays identical — zero mutations.
         *
         * Before: <span key=1/> <span key=2/> ... <span key=5/>
         * After:  <span key=1/> <span key=2/> ... <span key=5/>
         * Output: same 5 node refs, added=0, removed=0
         */
        const root = document.createElement("div");
        const id = Symbol();
        const keys = [1, 2, 3, 4, 5];
        const make = (ks) => ks.map((k) => <span key={k} data-key={k} />);

        const f1 = renderChildren(make(keys), null, root, id, false);
        const nodesBefore = fragmentChildren(f1).slice();

        const { added, removed } = countMutations(root, () => {
            renderChildren(make(keys), f1, root, id, false);
        });

        const nodesAfter = fragmentChildren(f1);
        nodesAfter.forEach((n, i) => expect(n).toBe(nodesBefore[i]));
        expect(added).toBe(0);
        expect(removed).toBe(0);
    });

    it("preserves node identity after keyed reorder (reverse)", () => {
        /**
         * After a full list reversal, every DOM node is the SAME element object —
         * only its position in the DOM changes (moveBefore / insertBefore).
         * No node is ever re-created.
         *
         * Before: <span key=1/> <span key=2/> <span key=3/> <span key=4/> <span key=5/>
         * After:  <span key=5/> <span key=4/> <span key=3/> <span key=2/> <span key=1/>
         * Output: same 5 node refs in reversed order
         */
        const root = document.createElement("div");
        const id = Symbol();
        const keys = [1, 2, 3, 4, 5];
        const make = (ks) => ks.map((k) => <span key={k} data-key={k} />);

        const f1 = renderChildren(make(keys), null, root, id, false);
        const nodeByKey = new Map(
            fragmentChildren(f1).map((n) => [Number((n as HTMLElement).dataset.key), n])
        );

        renderChildren(make([...keys].reverse()), f1, root, id, false);

        const nodesAfter = fragmentChildren(f1);
        // Each node must be the original DOM element, just repositioned
        nodesAfter.forEach((n) => {
            const k = Number((n as HTMLElement).dataset.key);
            expect(n).toBe(nodeByKey.get(k));
        });
        // Verify the order is now reversed
        nodesAfter.forEach((n, i) => {
            expect(Number((n as HTMLElement).dataset.key)).toBe(keys[keys.length - 1 - i]);
        });
    });

    it("removes keyed nodes that disappear from the list", () => {
        /**
         * Keys not present in the new list are removed from the DOM.
         * The remaining keys keep their original node identity.
         *
         * Before: <span key=1/> <span key=2/> <span key=3/> <span key=4/> <span key=5/>
         * After:  <span key=1/> <span key=3/> <span key=5/>
         * Output: 3 nodes with keys [1, 3, 5] — keys 2 and 4 removed
         */
        const root = document.createElement("div");
        const id = Symbol();
        const make = (ks) => ks.map((k) => <span key={k} data-key={k} />);

        const f1 = renderChildren(make([1, 2, 3, 4, 5]), null, root, id, false);
        renderChildren(make([1, 3, 5]), f1, root, id, false);

        const remaining = fragmentChildren(f1);
        expect(remaining.length).toBe(3);
        const keys = remaining.map((n) => Number((n as HTMLElement).dataset.key));
        expect(keys).toEqual([1, 3, 5]);
    });

    it("adds new keyed nodes not present in previous render", () => {
        /**
         * New keys that weren't in the previous render create new DOM nodes
         * and are inserted in the correct position.
         *
         * Before: <span key=1/> <span key=2/> <span key=3/>
         * After:  <span key=1/> <span key=2/> <span key=3/> <span key=4/> <span key=5/>
         * Output: 5 nodes in order [1, 2, 3, 4, 5]
         */
        const root = document.createElement("div");
        const id = Symbol();
        const make = (ks) => ks.map((k) => <span key={k} data-key={k} />);

        const f1 = renderChildren(make([1, 2, 3]), null, root, id, false);
        renderChildren(make([1, 2, 3, 4, 5]), f1, root, id, false);

        const nodes = fragmentChildren(f1);
        expect(nodes.length).toBe(5);
        nodes.forEach((n, i) =>
            expect(Number((n as HTMLElement).dataset.key)).toBe(i + 1)
        );
    });

    it("handles random keyed shuffles — always correct order", () => {
        /**
         * Over 20 random shuffles of 50 keyed items, the DOM order must always
         * match the declared order — regardless of how items moved.
         *
         * Before: <span key=?/> ×50  (any permutation)
         * After:  <span key=?/> ×50  (different permutation)
         * Output: DOM order === declared key order, every round
         */
        const root = document.createElement("div");
        const id = Symbol();
        const make = (ks) => ks.map((k) => <span key={k} data-key={k} />);
        let fragment;
        const SIZE = 50;

        for (let round = 0; round < 20; round++) {
            const list = shuffled(SIZE);
            fragment = renderChildren(make(list), fragment, root, id, false);
            const nodes = fragmentChildren(fragment);
            expect(nodes.length).toBe(list.length);
            nodes.forEach((n, i) =>
                expect(Number((n as HTMLElement).dataset.key)).toBe(list[i])
            );
        }
    });

    it("keyed: growing and shrinking preserves existing node identity", () => {
        /**
         * When a keyed list first grows then shrinks, the surviving nodes are
         * always the original DOM elements — never re-created.
         *
         * Render 1: <span key=1..5/>
         * Render 2: <span key=1..8/>   (grow)
         * Render 3: <span key=2,4,6/>  (shrink, pick subset)
         * Output: key=2 and key=4 are the exact same DOM nodes from render 1
         */
        const root = document.createElement("div");
        const id = Symbol();
        const make = (ks) => ks.map((k) => <span key={k} data-key={k} />);

        const f1 = renderChildren(make([1, 2, 3, 4, 5]), null, root, id, false);
        const originalNodes = new Map(
            fragmentChildren(f1).map((n) => [Number((n as HTMLElement).dataset.key), n])
        );

        // Grow
        renderChildren(make([1, 2, 3, 4, 5, 6, 7, 8]), f1, root, id, false);
        fragmentChildren(f1).slice(0, 5).forEach((n) => {
            const k = Number((n as HTMLElement).dataset.key);
            if (originalNodes.has(k)) expect(n).toBe(originalNodes.get(k));
        });

        // Shrink to a subset
        renderChildren(make([2, 4, 6]), f1, root, id, false);
        const final = fragmentChildren(f1);
        expect(final.length).toBe(3);
        expect(Number((final[0] as HTMLElement).dataset.key)).toBe(2);
        expect(Number((final[1] as HTMLElement).dataset.key)).toBe(4);
        expect(Number((final[2] as HTMLElement).dataset.key)).toBe(6);
        // key=2 and key=4 must be the original DOM elements from render 1
        expect(final[0]).toBe(originalNodes.get(2));
        expect(final[1]).toBe(originalNodes.get(4));
    });

    it("keyed list renders correctly across 100 random size/order changes", () => {
        /**
         * Stress test: 100 consecutive renders with random key order AND random
         * list size. After each render, DOM order must exactly match the declared
         * key order. Validates the reconciler handles all edge cases correctly.
         *
         * Before: <span key=?/> ×N   (random N, random order)
         * After:  <span key=?/> ×M   (different random M, different order)
         * Output: DOM order === declared key order, every iteration
         */
        const root = document.createElement("div");
        const id = Symbol();
        const make = (ks) => ks.map((k) => <span key={k} data-key={k} />);
        let fragment;
        let size = 100;

        while (size--) {
            const targetSize = Math.floor(Math.random() * size);
            const list = shuffled(Math.max(targetSize, 0) || 0).slice(0, targetSize);
            fragment = renderChildren(make(list), fragment, root, id, false);
            const nodes = fragmentChildren(fragment);
            expect(nodes.length).toBe(list.length);
            nodes.forEach((n, i) =>
                expect(Number((n as HTMLElement).dataset.key)).toBe(list[i])
            );
        }
    });
});

// ─── Size transitions ────────────────────────────────────────────────────────

describe("renderChildren — size transitions", () => {
    it("handles 0 → N → 0 → N transitions correctly", () => {
        /**
         * The fragment must correctly manage its cursor and cleanup through
         * dramatic size swings including a full clear back to zero.
         *
         * Before → After sequence:
         *   (empty) → ×66 → ×10 → ×0 → null → ×11 → ×33
         * Output: node count matches declared size at every step
         */
        const root = document.createElement("div");
        const id = Symbol();
        const make = (n) =>
            Array.from({ length: n }, (_, i) => <span data-id={i} />);
        let f;

        f = renderChildren(make(66), f, root, id, false);
        expect(fragmentChildren(f).length).toBe(66);

        f = renderChildren(make(10), f, root, id, false);
        expect(fragmentChildren(f).length).toBe(10);

        f = renderChildren(make(0), f, root, id, false);
        expect(fragmentChildren(f).length).toBe(0);

        f = renderChildren(null, f, root, id, false);
        expect(fragmentChildren(f).length).toBe(0);

        f = renderChildren(make(11), f, root, id, false);
        expect(fragmentChildren(f).length).toBe(11);

        f = renderChildren(make(33), f, root, id, false);
        expect(fragmentChildren(f).length).toBe(33);
    });

    it("data-id order matches index on every transition", () => {
        /**
         * Through multiple size changes, each node's data-id must always equal
         * its position index — no stale nodes and no displaced order.
         *
         * Sizes: 20 → 5 → 0 → 15 → 8
         * Output: node[i].dataset.id === i, every step
         */
        const root = document.createElement("div");
        const id = Symbol();
        let f;

        for (const size of [20, 5, 0, 15, 8]) {
            f = renderChildren(
                Array.from({ length: size }, (_, i) => <span data-id={i} />),
                f, root, id, false
            );
            const nodes = fragmentChildren(f);
            expect(nodes.length).toBe(size);
            nodes.forEach((n, i) =>
                // @ts-ignore
                expect(Number(n.dataset.id)).toBe(i)
            );
        }
    });
});

// ─── Mixed content ───────────────────────────────────────────────────────────

describe("renderChildren — mixed content", () => {
    it("mixes text and elements correctly", () => {
        /**
         * A list that contains both string children and element vnodes
         * produces the correct node types in the correct order.
         *
         * Before: (empty)
         * After:  ["label: ", <strong>value</strong>]
         * Output: [Text("label: "), <strong>]
         */
        const root = document.createElement("div");
        const id = Symbol();
        const fragment = renderChildren(
            ["label: ", <strong>value</strong>],
            null, root, id, false
        );
        const nodes = fragmentChildren(fragment);
        expect(nodes.length).toBe(2);
        expect(nodes[0]).toBeInstanceOf(Text);
        expect(nodes[1].nodeName).toBe("STRONG");
    });

    it("maps booleans, null, undefined to empty text placeholders", () => {
        /**
         * Falsy/boolean values mixed into the children array create empty Text nodes
         * to preserve their positional index in the DOM.
         *
         * Before: (empty)
         * After:  [null, false, undefined, <span/>, true, 0]
         * Output: [Text(""), Text(""), Text(""), <span>, Text(""), Text("0")]  — 6 nodes
         */
        const root = document.createElement("div");
        const id = Symbol();
        const fragment = renderChildren(
            [null, false, undefined, <span />, true, 0],
            null, root, id, false
        );
        const nodes = fragmentChildren(fragment);
        expect(nodes.length).toBe(6);
        expect(nodes[0]).toBeInstanceOf(Text);
        expect(nodes[0].textContent).toBe("");
        expect(nodes[1]).toBeInstanceOf(Text);
        expect(nodes[2]).toBeInstanceOf(Text);
        expect(nodes[3].nodeName).toBe("SPAN");
        expect(nodes[4]).toBeInstanceOf(Text);
        // 0 becomes the string "0" via flat() concatenation
        expect(nodes[5]).toBeInstanceOf(Text);
        expect(nodes[5].textContent).toBe("0");
    });

    it("re-render of mixed content preserves text node identity", () => {
        /**
         * On re-render, both the Text node and the element node are reused —
         * the text's .data is updated in place, the element is patched.
         * No node is removed and re-inserted.
         *
         * Before: <>hello <em/></>
         * After:  <>world <em/></>
         * Output: same Text node (.data="world "), same <em> element
         */
        const root = document.createElement("div");
        const id = Symbol();
        const f1 = renderChildren(["hello ", <em />], null, root, id, false);
        const textNode = fragmentChildren(f1)[0];
        const emNode = fragmentChildren(f1)[1];

        renderChildren(["world ", <em />], f1, root, id, false);

        expect(fragmentChildren(f1)[0]).toBe(textNode);
        expect(textNode.textContent).toBe("world ");
        expect(fragmentChildren(f1)[1]).toBe(emNode);
    });
});
