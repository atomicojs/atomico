import { c, type } from "atomico";

type Item = { id: number; value: string };

export const ComponentPropsType = c(
    (props) => {
        // 1. Valid Typed Prop
        const item: Item | undefined = props.item;
        if (item) {
            const id: number = item.id;
            const value: string = item.value;
        }

        // 2. Mismatched Prop (asserted below with expect-error)
        const faultyItem: Item | undefined = props.faultyItem;

        return <host />;
    },
    {
        props: {
            item: {
                type: type<Item>(Object),
                value: () => ({ id: 10, value: "Atomico" }) // 🟢 Valid (matches Item)
            },
            faultyItem: {
                type: type<Item>(Object),
                value: () => ({ id: 0, value: "Faulty Item" }) // 🔴 Invalid (fails compiling)
            }
        }
    }
);
