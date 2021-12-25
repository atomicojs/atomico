/**
 * Forces keys to be required
 */
export type RequiredField<Type, Fields extends keyof Type> = Omit<
    Type,
    Fields
> &
    Required<Pick<Type, Fields>>;
/**
 *
 */
export type RemoveFromString<
    S extends string | symbol | number,
    V extends string
> = S extends `${V}${infer R}` ? R : S extends `${infer R}${V}` ? R : S;
