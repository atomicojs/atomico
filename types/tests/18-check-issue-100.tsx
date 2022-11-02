import { Component, c } from "core";

type InputProps = {
    value1: "normal" | "dense" | "none";
    value2: { id: number };
    value3: false;
};

const defaultProps: Required<Pick<InputProps, "value1">> = {
    value1: "normal",
};

const input: Component<InputProps> = () => <host />;

input.props = {
    value1: {
        type: String,
        value: defaultProps.value1,
    },
    value2: {
        type: Object,
        value: { id: 100 },
    },
    value3: {
        type: Boolean,
        reflect: true,
        value: true,
    },
};

const checkGroup: Component<{ value: string[] }> = () => <host />;

checkGroup.props = {
    value: {
        type: Array,
        reflect: true, // this should work according, because Array prop is reflectable
        event: {
            type: "change",
            bubbles: true,
            composed: true,
            base: Event,
        },
    },
};

export const Input = c(input);

export const CheckGroup = c(checkGroup);

export type ContainerProps = {
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | false;
};

const Container: Component<ContainerProps> = () => <host></host>;

Container.props = {
    maxWidth: { reflect: true, value: "xl", event: { type: "click" } },
};
