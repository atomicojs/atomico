import { c } from "atomico";

export const MyComponent = c(() => <host></host>);

<MyComponent
    onclick={({ currentTarget }) => {
        currentTarget.updated.then(() => {});
    }}
>
    ...
</MyComponent>;

customElements.define("my-element", MyComponent);
