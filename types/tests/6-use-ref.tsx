import { useRef, useHost } from "core";
import { MyComponent } from "./1-basic";

const ref = useRef<HTMLElement>();

ref.current?.addEventListener("click", console.log);

const host = useHost();

host.current.updated.then(() => {
    console.log("mounted!");
});

const ref2 = useRef<typeof MyComponent>();

ref2.current?.increment?.(100);
