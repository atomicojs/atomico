import { createContext, useContext, useProvider } from "core";

const Provider = createContext({ count: 10 });

<Provider value={{ count: 1000 }}></Provider>;

const context = useContext(Provider);

context.count++;

useProvider(Provider, {
    count: 100
});
