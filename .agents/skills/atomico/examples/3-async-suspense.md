# Example: Async and Suspense

Demonstrating the correct use of `usePromise` in a child component and `useSuspense` in a parent component to orchestrate loading states.

> [!IMPORTANT]
> `useSuspense` only listens to its **children**. It cannot listen to promises in the same component, because async operations like `useAsync` block rendering. If you need to observe a promise in the same component, use `usePromise`.

```tsx
import { c, css, usePromise, useSuspense } from "atomico";

// --- CHILD COMPONENT ---
// Fetches data and broadcasts its state upwards
const fetchUserData = async (userId) => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    if (!res.ok) throw new Error("User not found");
    return res.json();
};

export const UserProfile = c(
    ({ userId }) => {
        // usePromise watches the promise and notifies any parent Suspense boundary
        const userPromise = usePromise(() => fetchUserData(userId), [userId]);

        return (
            <host shadowDom>
                {/* Render fallback inside if not using a parent boundary, or let the parent handle it */}
                {userPromise.pending && <p>Loading user data...</p>}
                
                {userPromise.fulfilled && (
                    <div class="user">
                        <h2>{userPromise.result.name}</h2>
                        <p>{userPromise.result.email}</p>
                    </div>
                )}
            </host>
        );
    },
    {
        props: {
            userId: { type: Number, value: () => 1 }
        }
    }
);

customElements.define("user-profile", UserProfile);

// --- PARENT COMPONENT ---
// Orchestrates multiple children and listens to their promise states
export const Dashboard = c(
    () => {
        // useSuspense listens to all usePromise calls in its child tree
        const suspense = useSuspense();

        return (
            <host shadowDom>
                <h1>Dashboard</h1>
                
                {/* The suspense status will be pending if ANY child promise is pending */}
                {suspense.pending ? (
                    <div class="spinner">Global Loading...</div>
                ) : (
                    <div class="success">All data loaded!</div>
                )}

                {/* We pass the constructor instances directly in JSX */}
                <div class="grid">
                    <UserProfile userId={1} />
                    <UserProfile userId={2} />
                </div>
            </host>
        );
    },
    {
        styles: css`
            :host { display: block; font-family: sans-serif; }
            .spinner { color: blue; }
        `
    }
);

customElements.define("app-dashboard", Dashboard);
```
