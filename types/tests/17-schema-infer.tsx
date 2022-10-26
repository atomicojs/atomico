import { Component, Props, c } from "core";

const x1: Component<{
    value1: number[];
    value2: Date;
    value3: MouseEvent;
    value4: HTMLElement;
    value5: File;
    value6: (count: number) => any;
    // add: (value: number) => number;
}> = (props) => (
    <host>
        {props.value1} {props.value2?.getDate()}
    </host>
);

x1.props = {
    value1: Array,
    value2: Date,
    value3: MouseEvent,
    value4: HTMLElement,
    value5: File,
    value6: Function,
};

const X1 = c(x1);

function x2({ value1 = [1, 2, 3] }: Props<typeof x2>) {
    return <host></host>;
}

x2.props = {
    ...X1.props,
};

const X2 = c(x1);

<X2
    value1={[1, 2, 3]}
    value2={new Date()}
    value3={new MouseEvent("click")}
    value4={document.createElement("div")}
    value6={(count: number) => {}}
/>;
