import { Props } from "core";

function component(props: Props<typeof component>) {
    return <host>{props.message}</host>;
}

component.props = {
    message: {
        type: String,
        event: {
            type: "change",
        },
        reflect: true,
        value: () => 10,
    },
} satisfies Props;

type TypeReflect = {
    reflect?: boolean;
};

type TypeEvent = {
    event?: {
        type: string;
        bubbles?: boolean;
        composed?: boolean;
    };
};

type TypeValue<Type> = {
    value?: Type | (() => Type);
};

type TypeType<Type> = {
    type: Type;
};

type TypeSchemaBasic<Type> = TypeValue<Type> &
    TypeEvent &
    TypeReflect &
    TypeType<Type>;

type TypeBasic<Type extends (...args: any[]) => any> =
    | Type
    | TypeSchemaBasic<ReturnType<Type>>;

type TypeNumber = TypeBasic<typeof Number>;

const s: TypeNumber = {
    type: Number,
};
