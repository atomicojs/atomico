import { useEvent } from "atomico";

const dispatch = useEvent<number>("ok", {
    bubbles: true,
    composed: true
});

dispatch(10);
