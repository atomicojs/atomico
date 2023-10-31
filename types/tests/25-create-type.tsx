import { Props, c, createType } from "core";

function myComponent({ check }: Props<typeof myComponent>) {
    return <host shadowDom>{check}</host>;
}

const TypeLoad = createType(
    (value: number) => Promise.resolve(value),
    (value) => `${value}`,
);

myComponent.props = {
    check: { type: TypeLoad },
};

const MyComponent = c(myComponent);

<MyComponent check={10}>...</MyComponent>;
