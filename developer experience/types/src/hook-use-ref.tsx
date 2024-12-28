import { useRef, useHost } from "atomico";
import { MyComponent } from "./component-with-event.js";

const ref = useRef<HTMLElement>();

ref.current?.addEventListener("click", console.log);

const host = useHost();

host.current.updated.then(() => {
    console.log("mounted!");
});

const ref2 = useRef<typeof MyComponent>();

ref2.current?.value2({ id: "welcome" });
