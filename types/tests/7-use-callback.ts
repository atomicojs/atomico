import { useCallback } from "core";

const callback = useCallback<(param: boolean) => number>(() => 10, [1, 2, 3]);

callback(true);

const isYearDisabled = useCallback(
    (dateToValidate: Date) => dateToValidate.getFullYear() === 2022,
    [1, 2],
);

isYearDisabled(new Date());
