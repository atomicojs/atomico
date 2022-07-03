if (!globalThis.document || !globalThis.customElements) {
    await import("./ssr/load.js");
}
