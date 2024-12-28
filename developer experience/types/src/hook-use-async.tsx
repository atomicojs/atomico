import { useAsync, useAbortController } from "atomico";

async function getUser(id: number, signal: AbortSignal) {
    return fetch(`/id/${id}`, { signal });
}

const { signal } = useAbortController([1, true]);

useAsync(getUser, [1, signal]);
