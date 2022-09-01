import { createContext, useContext } from "core";

const Provider = createContext({ count: 10 });

<Provider
    value={{ count: 1000 }}
    onUpdatedContext={(event) => {
        /* context update! */
        if (event.currentTarget.value != null) {
            event.currentTarget.value.count++;
        }
    }}
></Provider>;

const context = useContext(Provider);

context.count++;
