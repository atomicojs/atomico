import { Props, c, Host } from "core";

function myComponent({ value }: Props<typeof myComponent>): Host<{
    onChange: CustomEvent<{ id: number }>;
    increment(value: number): void;
}> {
    return <host shadowDom>{value}</host>;
}

myComponent.props = {
    value: String,
    value2: Array,
};

export const MyComponent = c(myComponent);

<MyComponent
    value={"ok"}
    value2={[]}
    onclick={() => {}}
    onChange={(event) => {
        event.detail.id++;
        event.currentTarget.value;
    }}
>
    ...
</MyComponent>;

customElements.define("my-element", MyComponent);
