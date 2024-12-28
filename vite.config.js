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
            provider: "istanbul",
            enabled: true,
            include: ["src/**/*"]
        }
    }
});
