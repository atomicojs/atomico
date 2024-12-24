import { describe, expect, it } from "vitest";
import { c } from "../../core.js";
import { live } from "../../tests/element.test.js";
import {
    useAbortController,
    usePromise,
    useSuspense
} from "../custom-hooks.js";
import { useEffect } from "../hooks.js";
import { delay } from "./utils.js";

describe("usePromise", () => {
    it("unmounted", async () => {
        const Component = c(() => {
            usePromise(() => delay(), []);
            return <host></host>;
        });

        const node = live(Component);

        await delay();

        node.remove();
    });
    it("Ignore autorun", async () => {
        const Component = c(() => {
            usePromise(() => delay(), [], false);
            return <host></host>;
        });

        live(Component);

        await delay();
    });
    it("regeneration", async () => {
        const Component = c(
            ({ count }) => {
                usePromise((count) => delay(), [count]);
                return <host></host>;
            },
            {
                props: {
                    count: { type: Number, value: () => 0 }
                }
            }
        );

        const node = live(Component);

        node.count++;

        await delay();

        node.count++;
    });
    it("resolved", async () => {
        const task = Promise.withResolvers();
        const status = [];

        const Parent = c(() => {
            const state = useSuspense();
            status.push(state);
            return <host></host>;
        });

        const Child = c(() => {
            usePromise(() => {
                task.resolve(10);
                return task.promise;
            }, []);
            return <host></host>;
        });
        const parent = live(Parent, false);
        const child = live(Child, false);

        parent.append(child);
        document.body.append(parent);

        await task.promise;

        await delay();

        expect(status).toEqual([{ pending: true }, { fulfilled: true }]);
    });

    it("rejected", async () => {
        const task = Promise.withResolvers();
        const status = [];

        const Parent = c(() => {
            const state = useSuspense();
            status.push(state);
            return <host></host>;
        });

        const Child = c(() => {
            usePromise(() => {
                task.reject(10);
                return task.promise;
            }, []);
            return <host></host>;
        });
        const parent = live(Parent, false);
        const child = live(Child, false);

        parent.append(child);

        document.body.append(parent);

        await task.promise.catch(() => {});

        await delay();

        expect(status).toEqual([{ pending: true }, { rejected: true }]);
    });
    it("abort", async () => {
        const status = [];

        const Parent = c(() => {
            const state = useSuspense();
            status.push(state);
            return <host></host>;
        });

        const Child = c(() => {
            const controller = useAbortController([]);

            usePromise(() => {
                return fetch("/", { signal: controller.signal });
            }, []);

            useEffect(() => {
                controller.abort();
            }, []);

            return <host></host>;
        });
        const parent = live(Parent, false);
        const child = live(Child, false);

        parent.append(child);

        document.body.append(parent);

        await delay();

        expect(status).toEqual([{ pending: true }, { aborted: true }]);

        child.remove();

        await delay();
    });
});
