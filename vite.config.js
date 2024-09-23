import { defineConfig } from "vite";

export default defineConfig({
    test: {
        include: ["./src/**/*.test.tsx"],
        environment: "jsdom"
    }
});
