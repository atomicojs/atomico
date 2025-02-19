import { c, useRender } from "atomico";

export const EgUseRender = c(() => {
    useRender(() => <button>Button!</button>);
    return (
        <host shadowDom>
            <slot />
        </host>
    );
});

customElements.define("eg-use-render", EgUseRender);
