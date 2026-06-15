import { c } from "atomico";

export const MyComponent = c(() => <host></host>);

<MyComponent
    onclick={({ currentTarget }: any) => {
        currentTarget.updated.then(() => {});
    }}
>
    ...
</MyComponent>;

customElements.define("my-element", MyComponent);
