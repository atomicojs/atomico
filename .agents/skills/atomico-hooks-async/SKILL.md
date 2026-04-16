---
name: atomico-hooks-async
description: >
  Use usePromise, useAsync, useSuspense, and useAbortController hooks for
  asynchronous data fetching and loading state management. Triggers when the
  user needs to fetch data, handle loading/error/fulfilled states, implement
  suspense boundaries, or abort in-flight requests in Atomico components.
license: MIT
compatibility: "Atomico >=1.79"
metadata:
  category: hooks
  priority: high
---

# Async Hooks

## `usePromise` — Promise State Tracking

Executes an async callback and tracks its lifecycle state (pending, fulfilled,
rejected, aborted). Integrates with `useSuspense` automatically.

### API

```ts
const state = usePromise(callback, args?, autorun?);
```

### Return Type

```ts
interface PromiseState<T> {
    result?: T;
    pending?: boolean;
    fulfilled?: boolean;
    rejected?: boolean;
    aborted?: boolean;
}
```

### Basic Usage

```tsx
import { c, usePromise } from "atomico";

interface Photo {
    albumId: number;
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
}

const PhotoList = c(() => {
    const promise = usePromise(
        async (): Promise<Photo[]> =>
            await fetch("https://jsonplaceholder.typicode.com/photos")
                .then((res) => res.json()),
        []  // Dependencies — empty = run once
    );

    return (
        <host>
            <ul>
                {promise.fulfilled ? (
                    promise.result.map((item) => <li>{item.title}</li>)
                ) : (
                    <li>Loading...</li>
                )}
            </ul>
        </host>
    );
});
```

### With Dependencies

```tsx
const UserProfile = c(
    ({ userId }) => {
        const promise = usePromise(
            async (id: number) =>
                fetch(`/api/users/${id}`).then((r) => r.json()),
            [userId]  // Re-fetches when userId changes
        );

        return (
            <host>
                {promise.pending && <p>Loading...</p>}
                {promise.fulfilled && <h1>{promise.result.name}</h1>}
                {promise.rejected && <p>Error loading user</p>}
            </host>
        );
    },
    { props: { userId: Number } }
);
```

### Conditional Execution (autorun)

```tsx
const [shouldFetch, setShouldFetch] = useState(false);

const promise = usePromise(
    async () => fetch("/api/data").then((r) => r.json()),
    [],
    shouldFetch  // Only executes when true
);
```

---

## `useAsync` — Suspense-Based Async

Wraps `usePromise` but throws a `SUSPENSE` signal while pending. The component
won't render until the promise resolves. **Must be used within a `useSuspense`
boundary**.

### API

```ts
const result = useAsync<T>(callback, args);
```

### Usage

```tsx
import { c, useAsync } from "atomico";

const PhotoList = c(() => {
    // Component suspends until data is available
    const result = useAsync(
        async (): Promise<Photo[]> =>
            await fetch("https://jsonplaceholder.typicode.com/photos")
                .then((res) => res.json()),
        []
    );

    // `result` is always the resolved value — no pending/rejected checks needed
    return (
        <host>
            <ul>
                {result.map((item) => <li>{item.title}</li>)}
            </ul>
        </host>
    );
});
```

> **Note**: If `useAsync` is used without a `useSuspense` parent, the SUSPENSE
> error will propagate and the component won't render at all.

---

## `useSuspense` — Loading Boundary

Creates a suspense boundary that tracks all `usePromise`/`useAsync` states in
its subtree via context. Returns an aggregated status.

### API

```ts
const status = useSuspense(fps?: number);
```

### Return Type

```ts
interface SuspenseStatus {
    pending?: boolean;
    fulfilled?: boolean;
    rejected?: boolean;
    aborted?: boolean;
}
```

### Usage

```tsx
import { c, css, useSuspense, usePromise } from "atomico";

const DataLoader = c(
    ({ delay }) => {
        const promise = usePromise(
            async (ms: number): Promise<string> =>
                new Promise((resolve) => setTimeout(() => resolve("done"), ms)),
            [delay]
        );

        return (
            <host>
                {promise.pending
                    ? `Loading... (${delay}ms)`
                    : promise.fulfilled
                    ? promise.result
                    : ""}
            </host>
        );
    },
    { props: { delay: Number } }
);

const App = c(
    () => {
        const status = useSuspense();

        return (
            <host shadowDom>
                <h1>{status.pending ? "Loading..." : "All done!"}</h1>
                <DataLoader delay={3000} />
                <DataLoader delay={5000} />
            </host>
        );
    },
    {
        styles: css`
            :host { display: grid; gap: 1rem; }
        `
    }
);
```

### Context Integration

`useSuspense` uses Atomico's context system internally. The `SuspenseContext`
propagates through the DOM tree, so any `usePromise` call in a descendant
automatically communicates its status to the nearest `useSuspense` ancestor.

---

## `useAbortController` — Cancellable Requests

Creates an `AbortController` that is automatically aborted when dependencies
change or the component unmounts.

### API

```ts
const controller = useAbortController(args);
```

### Usage with Fetch

```tsx
import { c, useAbortController, usePromise } from "atomico";

const MyComponent = c(
    ({ query }) => {
        const controller = useAbortController([query]);

        const promise = usePromise(
            async (q: string) =>
                fetch(`/api/search?q=${q}`, {
                    signal: controller.signal
                }).then((r) => r.json()),
            [query]
        );

        return (
            <host>
                {promise.pending && <p>Searching...</p>}
                {promise.aborted && <p>Request cancelled</p>}
                {promise.fulfilled && <p>Found: {promise.result.length}</p>}
            </host>
        );
    },
    { props: { query: String } }
);
```

### Lifecycle

1. A new `AbortController` is created via `useMemo` when `args` change
2. The previous controller is aborted via `useEffect` cleanup
3. On component unmount, the current controller is aborted
