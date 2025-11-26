/**
 * The next example demonstrates the useEffect hook in Atomico.
 * Atomico hooks provide lifecycle management similar to React hooks.
 */
import { c, useEffect, useState, useUpdate } from "atomico";

export const EgUseEffect = c(() => {
    const [count, setState] = useState(0);
    const update = useUpdate();
    /**
     * Exaple of useEffect hook
     */
    useEffect(() => {
        console.log("Component MOUNTED - ConenctedCallback");
        return () => {
            console.log("Component UNMOUNTED - DisconectedCallback");
        };
    }, []);

    useEffect(() => {
        console.log("Component UPDATED - count:", count);
        return () => {
            console.log("Component PRE-UPDATE - count:", count);
        };
    }, [count]);
    return (
        <host>
            Check console!{" "}
            <button
                onclick={() => {
                    setState(count + 1);
                }}
            >
                Increment
            </button>
            <button
                onclick={() => {
                    console.log(
                        "Forced update, no useEffect log should appear"
                    );
                    update();
                }}
            >
                Force update
            </button>
            <button
                onclick={({ target }) => {
                    (target.parentNode as Element).remove();

                    setTimeout(() => {
                        document.body.appendChild(target.parentNode);
                    }, 2000);
                }}
            >
                Remove component!
            </button>
        </host>
    );
});

customElements.define("example-use-effect", EgUseEffect);
