import { c, useRender, css, useState } from "atomico";

export const EgUseRender = c(
    () => {
        const [state, setState] = useState(0);
        useRender(() => (
            <button onclick={() => setState(state + 1)}>
                This button is in the light DOM, but it was rendered from within
                the web component. {state}
            </button>
        ));
        return (
            <host shadowDom>
                ShadowDom! {state} :
                <slot />
            </host>
        );
    },
    {
        styles: css`
            :host {
                display: block;
                padding: 1rem;
                border: 2px dashed green;
            }
        `
    }
);

customElements.define("example-use-render", EgUseRender);
