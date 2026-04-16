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

    it("memo option preserves previous state", async () => {
        let lastState: any;
        const task1 = Promise.withResolvers();
        const task2 = Promise.withResolvers();

        const Component = c(
            ({ count }) => {
                const state = usePromise(() => count === 0 ? task1.promise : task2.promise, [count], { memo: true });
                lastState = state;
                return <host></host>;
            },
            {
                props: {
                    count: { type: Number, value: () => 0 }
                }
            }
        );

        const node = live(Component);
        await delay();

        expect(lastState.pending).toBeTruthy();
        expect(lastState.result).toBeUndefined();

        task1.resolve("first");
        await task1.promise;
        await delay();

        expect(lastState.fulfilled).toBeTruthy();
        expect(lastState.result).toBe("first");
        expect(lastState.startTime).toBeDefined();
        expect(lastState.endTime).toBeDefined();

        node.count++;
        await delay();

        expect(lastState.pending).toBeTruthy();
        expect(lastState.result).toBe("first"); // Preserved by memo
        expect(lastState.startTime).toBeDefined();

        task2.resolve("second");
        await task2.promise;
        await delay();

        expect(lastState.fulfilled).toBeTruthy();
        expect(lastState.result).toBe("second");
        expect(lastState.endTime).toBeGreaterThanOrEqual(lastState.startTime);
    });

    it("memo option preserves error state", async () => {
        let lastState: any;
        const task1 = Promise.withResolvers();
        const task2 = Promise.withResolvers();

        const Component = c(
            ({ count }) => {
                const state = usePromise(() => count === 0 ? task1.promise : task2.promise, [count], { memo: true });
                lastState = state;
                return <host></host>;
            },
            {
                props: { count: { type: Number, value: () => 0 } }
            }
        );

        const node = live(Component);

        task1.reject("error1");
        await task1.promise.catch(() => {});
        await delay();

        expect(lastState.rejected).toBeTruthy();
        expect(lastState.error).toBe("error1");

        node.count++;
        await delay();

        expect(lastState.pending).toBeTruthy();
        expect(lastState.error).toBe("error1"); // Preserved error by memo

        task2.resolve("ok2");
        await task2.promise;
        await delay();

        expect(lastState.fulfilled).toBeTruthy();
        expect(lastState.result).toBe("ok2");
        expect(lastState.error).toBeUndefined(); // Should be clean on resolve
    });
});
