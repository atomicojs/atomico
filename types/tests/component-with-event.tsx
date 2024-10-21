import { c, event } from "core";

export const MyComponent = c(
    (props) => (
        <host shadowDom>
            <h1>{props.value1}</h1>
            <button onclick={() => props.value2({ id: "welcome" })}></button>
        </host>
    ),
    {
        props: {
            value1: String,
            value2: event<{ id: string }>({
                composed: true
            })
        }
    }
);

<MyComponent
    value1={"ok"}
    value2={[]}
    onvalue2={({ currentTarget, detail }) => {
        detail.id;
        currentTarget.value1;
        currentTarget.value2({ id: "welcome" });
    }}
>
    ...
</MyComponent>;

customElements.define("my-element", MyComponent);
