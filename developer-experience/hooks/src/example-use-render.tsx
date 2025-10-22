import { c, useRender, css } from "atomico";

export const EgUseRender = c(
    () => {
        useRender(() => (
            <button>
                This button is in the light DOM, but it was rendered from within
                the web component.
            </button>
        ));
        return (
            <host shadowDom>
                ShadowDom! :
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
