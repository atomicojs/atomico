import { c, useEffect, useState, useUpdate } from "atomico";

export const EgUseEffect = c(() => {
    const update = useUpdate();
    const [count, setCount] = useState(0);
    useEffect(() => {
        console.log("CICLE");
        return () => {
            console.log("CLEAN");
        };
    }, [count]);
    return (
        <host>
            <h5>count: {count}</h5>
            <button onclick={() => setCount(count + 1)}>Increment</button>
            <button onclick={update}>update</button>
        </host>
    );
});

customElements.define("eg-use-effect", EgUseEffect);
