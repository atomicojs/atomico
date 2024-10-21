import { useMemo } from "core";

const result = useMemo(() => 100, [1, 2, 3]);

result + 1;
