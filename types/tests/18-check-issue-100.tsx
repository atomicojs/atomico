import { Component } from "core";

type InputProps = {
    margin: "normal" | "dense" | "none";
};

const defaultProps: Required<Pick<InputProps, "margin">> = {
    margin: "normal",
};

const Input: Component<InputProps> = () => <host />;

Input.props = {
    margin: {
        type: String,
        event: {
            type: "change",
        },
        attr: "margin-1",
        value: defaultProps.margin,
    },
};
