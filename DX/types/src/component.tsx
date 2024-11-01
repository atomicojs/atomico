import { c } from "atomico";

export const MyComponent = c(() => <host></host>, {
    props: {
        value1: String,
        value2: Array,
        value3: Array
    }
});

<MyComponent
    value1={"ok"}
    value2={[]}
    onclick={({ currentTarget }) => {
        currentTarget.value2;
    }}
>
    ...
</MyComponent>;

customElements.define("my-element", MyComponent);
