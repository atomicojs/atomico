import { useEvent } from "core";

const dispatch = useEvent<number>("ok", {
    bubbles: true,
    composed: true,
});

dispatch(10);
