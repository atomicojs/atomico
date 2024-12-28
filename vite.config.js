import { defineConfig } from "vite";

export default defineConfig({
    test: {
        include: ["./src/**/*.test.{tsx,jsx,ts}"],
        browser: {
            provider: "playwright", // or 'webdriverio'
            enabled: true,
            name: "chromium",
            headless: true
        },
        coverage: {
            provider: "v8",
            enabled: true,
            include: ["src/**/*"]
        }
    }
});
