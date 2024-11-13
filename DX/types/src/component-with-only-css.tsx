import { c, css } from "atomico";

export const MyComponent = c(
    () => (
        <host shadowDom>
            <h1>welcome</h1>
        </host>
    ),
    {
        styles: css`
            :host {
            }
        `
    }
);

<MyComponent value1={"ok"}>...</MyComponent>;

customElements.define("my-element", MyComponent);
