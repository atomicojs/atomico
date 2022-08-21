import { c, Component } from "core";

const myComponent: Component<
    { value: string },
    { onChange: CustomEvent<{ id: number }>; myMethod(value: number): void }
> = ({ value }) => {
    return <host shadowDom>{value}</host>;
};

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

const instance = new MyComponent();

instance.myMethod(10);

customElements.define("my-element", MyComponent);
