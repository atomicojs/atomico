import { Props, c, createType, useRef } from "core";

function myComponent({ date }: Props<typeof myComponent>) {
    return <host shadowDom>{date.toLocaleDateString()}</host>;
}

const TypeDate = createType((value: Date | string) =>
    value instanceof Date ? value : new Date(value)
);

myComponent.props = {
    date: { type: TypeDate, value: new Date() }
};

const MyComponent = c(myComponent);

<MyComponent
    onclick={({ currentTarget }) => {
        currentTarget.date.toLocaleDateString();
    }}
    date={"December 17, 1995 03:24:00"}
>
    ...
</MyComponent>;

const instanceMyComponent = new MyComponent();

instanceMyComponent.date.toLocaleDateString();

const { current } = useRef<typeof MyComponent>();

current.date.toLocaleDateString();
