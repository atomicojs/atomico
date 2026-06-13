# Asynchronous Operations & Suspense Guide

This guide covers managing asynchronous lifecycles, suspending component rendering, and handling request cancellations.

## 1. Tracking Promise States (`usePromise`)

`usePromise` executes an asynchronous function and returns reactive status states (`pending`, `fulfilled`, `rejected`, `result`).

```tsx
import { c, usePromise } from "atomico";

const fetchUserData = async (userId: string) => {
    const res = await fetch(`https://api.github.com/users/${userId}`);
    if (!res.ok) throw new Error("User not found");
    return res.json();
};

export const UserInspector = c(
    ({ userId = "" }) => {
        // Track the promise state reactively
        const [promise] = usePromise(() => fetchUserData(userId), [userId]);

        if (promise.pending) return <host shadowDom><p>Loading user profile...</p></host>;
        if (promise.rejected) return <host shadowDom><p>Error: {promise.error?.message}</p></host>;

        const user = promise.result;
        return (
            <host shadowDom>
                <div class="user-card">
                    <img src={user.avatar_url} alt={user.name} />
                    <h2>{user.name}</h2>
                </div>
            </host>
        );
    },
    {
        props: { userId: String }
    }
);
```

---

## 2. Suspense Boundaries & Grouped Control (`useAsync` & `useSuspense`)

`useSuspense` acts as an aggregate observer. It captures and tracks the lifecycle of **any nested promise** running within its sub-tree that is managed by either `useAsync` or `usePromise`. This makes it ideal for global loading overlays or locking UI interactions while child elements fetch data.

```tsx
import { c, useAsync, useSuspense } from "atomico";

const fetchPosts = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    return res.json();
};

const fetchComments = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/comments");
    return res.json();
};

// 1. Child component fetching posts (suspends rendering)
export const PostList = c(() => {
    const posts = useAsync(fetchPosts, []);
    return (
        <host shadowDom>
            <ul>
                {posts.slice(0, 3).map((p: any) => <li key={p.id}>{p.title}</li>)}
            </ul>
        </host>
    );
});

// 2. Child component fetching comments (suspends rendering)
export const CommentList = c(() => {
    const comments = useAsync(fetchComments, []);
    return (
        <host shadowDom>
            <ul>
                {comments.slice(0, 3).map((c: any) => <li key={c.id}>{c.body}</li>)}
            </ul>
        </host>
    );
});

// 3. Parent container managing grouped loading state
export const DashboardLayout = c(() => {
    // ✅ Aggregates both PostList and CommentList pending promises
    const suspense = useSuspense();

    return (
        <host shadowDom>
            <div class={`dashboard-container ${suspense.pending ? "locked-interaction" : ""}`}>
                {suspense.pending && (
                    <div class="global-loading-overlay">
                        <p>Syncing data structures...</p>
                    </div>
                )}
                <div class="content">
                    <PostList />
                    <CommentList />
                </div>
            </div>
        </host>
    );
});
```

---

## 3. Cancelling Fetch Requests (`useAbortController`)

To prevent memory leaks and race conditions, use `useAbortController` to automatically cancel active promises when dependencies change or the component unmounts.

```tsx
import { c, usePromise, useAbortController } from "atomico";

export const SearchField = c(
    ({ query = "" }) => {
        // 1. Generates a controller that aborts on query changes or unmount
        const controller = useAbortController([query]);

        // 2. Run fetch attaching the signal
        const [promise] = usePromise(async () => {
            if (!query) return [];
            const response = await fetch(`/api/search?q=${query}`, { signal: controller.signal });
            return response.json();
        }, [query]);

        return (
            <host shadowDom>
                {promise.pending && <p>Searching...</p>}
                <ul>
                    {promise.result?.map((item: any) => (
                        <li key={item.id}>{item.name}</li>
                    ))}
                </ul>
            </host>
        );
    },
    {
        props: { query: String }
    }
);
```
