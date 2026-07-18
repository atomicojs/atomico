import { c, CustomType } from "atomico";

type Option = { value: string; label: string };
type Item = { id: number };

export const ComponentPropsOptions = c((props) => {
    // 1. Array Test: Should be Array<Option>
    const options: Array<Option> = props.options;
    props.options.forEach((opt) => {
        const val: string = opt.value;
    });

    // 2. Set Test: Should be Set<Item>
    const mySet: Set<Item> = props.mySet;
    props.mySet.forEach((item) => {
        const id: number = item.id;
    });

    // 3. Map Test: Should be Map<string, number>
    const myMap: Map<string, number> = props.myMap;
    const val: number | undefined = props.myMap.get("key");

    return <host />;
}, {
    props: {
        options: {
            type: Array as unknown as CustomType<Array<Option>>,
            value: () => []
        },
        mySet: {
            type: Set as unknown as CustomType<Set<Item>>,
            value: () => new Set<Item>()
        },
        myMap: {
            type: Map as unknown as CustomType<Map<string, number>>,
            value: () => new Map()
        }
    }
});
