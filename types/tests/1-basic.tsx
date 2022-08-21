import { Props, c, Host } from "core";

function myComponent({
    value,
}: Props<typeof myComponent>): Host<{
    onChange: CustomEvent<{ id: number }>;
    increment(value: number): void;
}> {
    return <host shadowDom>{value}</host>;
}

myComponent.props = {
    value: String,
};

export const MyComponent = c(myComponent);

<MyComponent
    value={"ok"}
    onclick={() => {}}
    onChange={(event) => {
        event.detail.id++;
    }}
>
    ...
</MyComponent>;

customElements.define("my-element", MyComponent);
