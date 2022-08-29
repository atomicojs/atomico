import { useCallback } from "core";

const callback = useCallback((param: boolean) => 10, [1, 2, 3]);

callback(true);
