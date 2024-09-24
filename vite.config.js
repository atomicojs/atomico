import { defineConfig } from "vite";

export default defineConfig({
    test: {
        include: ["./src/**/*.test.tsx"],
        browser: {
            provider: "playwright", // or 'webdriverio'
            enabled: true,
            name: "chromium" // browser name is required
        }
    }
});
