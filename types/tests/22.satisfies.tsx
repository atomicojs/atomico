import { Props, c } from "core";

function component(props: Props<typeof component>) {
    return (
        <host>
            {props.range} && {props.next}
        </host>
    );
}

component.props = {
    range: Number,
    next: {
        type: String,
        event: {
            type: "demo",
        },
    },
} satisfies Props;

const Component = c(component);

const instanceComponent = new Component();

if (instanceComponent.range != null) {
    instanceComponent.range++;
}
