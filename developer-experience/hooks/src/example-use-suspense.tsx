import { c, css, useSuspense, usePromise } from "atomico";
import { EgUsePromise } from "./example-use-promise.js";
import { EgUseAsync } from "./example-use-async.js";

export const EgUseSuspenseCustomDelay = c(
    ({ delay }) => {
        const promise = usePromise(
            async (delay: number): Promise<string> => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve("done");
                    }, delay);
                });
            },
            [delay]
        );

        return (
            <host>
                {promise.pending
                    ? `Loading... (fake delay ${delay}ms)`
                    : promise.fulfilled
                    ? promise.result
                    : ""}
            </host>
        );
    },
    {
        props: {
            delay: Number
        }
    }
);

export const EgUseSuspense = c(
    () => {
        const promise = useSuspense();

        return (
            <host shadowDom>
                <h1>{promise.pending ? "Loading..." : "Resolve"}</h1>
                <EgUseSuspenseCustomDelay delay={5000} />
                <div class="columns">
                    <EgUsePromise />
                    <EgUseAsync />
                </div>
            </host>
        );
    },
    {
        styles: css`
            :host {
                display: grid;
                gap: 1rem;
            }
            .columns {
                display: grid;
                grid-template-columns: 1fr 1fr;
            }
        `
    }
);

customElements.define(
    "example-use-suspense-custom-delay",
    EgUseSuspenseCustomDelay
);
customElements.define("example-use-suspense", EgUseSuspense);
