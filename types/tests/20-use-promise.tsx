import { usePromise } from "core";

const getUsers = (id: number) => Promise.resolve({ id, name: "Uppercod" });

const promise = usePromise(getUsers, [1]);

promise.fulfilled ? promise.result.id : promise.pending && <h1>Loading...</h1>;
