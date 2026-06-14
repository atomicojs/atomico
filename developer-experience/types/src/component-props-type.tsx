import { c, type } from "atomico";

type Item = { id: number; value: string };

export const ComponentPropsType = c(
    (props) => {
        // 💡 TypeScript Static Assertion Test:
        // props.item should be inferred as Item instead of any or unknown
        const item: Item | undefined = props.item;
        if (item) {
            const id: number = item.id;
            const value: string = item.value;
        }

        return <host />;
    },
    {
        props: {
            item: {
                type: type<Item>(Object),
                value: () => ({})
            }
        }
    }
);
