import { useEffect, useRefEffect, createRef } from "core";

useEffect(() => () => {});
useEffect(() => {}, []);
useEffect<number>(() => {}, [1, 2, 3]);

const r = createRef(10);

useRefEffect(() => {
    r.current.toFixed(10);
}, [r]);
