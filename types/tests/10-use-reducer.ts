import { useReducer } from "core";

const [state, dispatch] = useReducer(
    (state: number, payload: { value: number }) => state + payload.value,
);

dispatch({ value: state + 100 });

const [state2, dispatch2] = useReducer(
    (state: number, payload: { value: 1000 | 2000 }): 1000 | 2000 =>
        payload.value,
    1000,
    (init) => (init === 1000 ? 2000 : 1000),
);

dispatch2({ value: state2 });
