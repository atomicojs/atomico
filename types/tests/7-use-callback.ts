import { useCallback } from "core";

const callback = useCallback((param: boolean) => 10);

callback(true);
