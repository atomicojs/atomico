if (!globalThis.document || !globalThis.customElements) {
    await import("./load.js");
}
