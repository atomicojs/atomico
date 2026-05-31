# Example: Request Aborting using useAbortController

Comprehensive reference showing how to implement safe, cancellable in-flight async requests using `useAbortController` and `usePromise`.

```tsx
import { c, usePromise, useAbortController, css } from "atomico";

export const UserSearch = c(
    ({ query }) => {
        // 1. useAbortController: Auto-aborted whenever dependency [query] changes
        const controller = useAbortController([query]);

        // 2. usePromise: Safely call async fetch passing abort signal
        const search = usePromise(
            async (searchQuery: string) => {
                if (!searchQuery) return [];
                return fetch(`/api/users?q=${searchQuery}`, {
                    signal: controller.signal
                }).then((res) => res.json());
            },
            [query]
        );

        return (
            <host shadowDom>
                <h2>Searching users for: "{query}"</h2>

                {search.pending && <p class="loading">Fetching data...</p>}
                {search.aborted && <p class="aborted">Previous request was aborted</p>}
                
                {search.fulfilled && (
                    <ul>
                        {search.result.map((user: { id: number; name: string }) => (
                            <li key={user.id}>{user.name}</li>
                        ))}
                    </ul>
                )}
            </host>
        );
    },
    {
        props: {
            query: String
        },
        styles: css`
            :host { display: block; padding: 1rem; }
            .loading { color: grey; }
            .aborted { color: orange; font-style: italic; }
        `
    }
);

customElements.define("user-search", UserSearch);
```
