// import { Component } from "core";
import { SchemaInfer } from "../schema";

type InputProps = {
    margin: "normal" | "dense" | "none";
};

const defaultProps: Required<Pick<InputProps, "margin">> = {
    margin: "normal",
};

// const Input: Component<InputProps> = () => <host />;

// Input.props = {
//     margin: { type: String, value: () => defaultProps.margin },
// };

const props1: SchemaInfer<InputProps> = {
    margin: {
        type: String,
        value: defaultProps.margin,
    },
};

const props2: SchemaInfer<InputProps> = {
    margin: {
        type: String,
        value: () => defaultProps.margin,
    },
};
