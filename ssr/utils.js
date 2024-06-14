export const isServer = () =>
    "document" in globalThis
        ? false
        : globalThis?.Deno || globalThis?.process?.versions?.node;
