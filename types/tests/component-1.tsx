import { Props, c, Host } from "core";

function myComponent({
    value,
}: Props<typeof myComponent>): Host<{ onChange: CustomEvent<{ id: number }> }> {
    return <host shadowDom>{value}</host>;
}

myComponent.props = {
    value: String,
};

const MyComponent = c(myComponent);

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
