import { c } from "../../core";

const MyTodo = c(
    () => {
        return <host>welcome</host>;
    },
    {
        props: {}
    }
);

customElements.define("atomico-todo", MyTodo);
