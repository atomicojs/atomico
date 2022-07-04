export const isServer = () =>
    globalThis?.Deno || globalThis?.process?.versions?.node;
