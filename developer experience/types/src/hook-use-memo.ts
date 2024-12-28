import { useMemo } from "atomico";

const result = useMemo(() => 100, [1, 2, 3]);

result + 1;
