import { Props, c } from "core";

function component(props: Props<typeof component>) {
    return (
        <host>
            {props.caseMargin1}
            {props.caseMargin2}
        </host>
    );
}

type InputProps = {
    margin: "normal" | "dense" | "none";
};

const defaultProps: Required<Pick<InputProps, "margin">> = {
    margin: "normal",
};

component.props = {
    // CASE
    caseMargin1: {
        type: String,
        value: defaultProps.margin,
    },
    // CASE
    caseMargin2: {
        type: String,
        value: () => defaultProps.margin,
    },
};

export const Component = c(component);
