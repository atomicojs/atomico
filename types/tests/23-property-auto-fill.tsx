import { c, Props } from "core";

function component({ value }: Props<typeof component>) {
    return <host>{value * 2}</host>;
}

component.props = {
    value: {
        type: Number,
        value: 0,
    },
};

const Component = c(component);

<Component
    onclick={(event) => {
        event.currentTarget.value;
    }}
    value={null}
    message="welcome"
    $message={null}
></Component>;
