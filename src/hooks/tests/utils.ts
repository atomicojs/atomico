export const delay = (ms = 200, value = undefined) =>
    new Promise((resolve) => setTimeout(resolve, ms, value));
