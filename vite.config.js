import { defineConfig } from "vite";

export default defineConfig({
    test: {
        include: ["./src/**/*.test.{tsx,jsx,ts}"],
        browser: {
            provider: "webdriverio", // or 'webdriverio'
            enabled: true,
            name: "chrome"
            // headless: true,
        },
        coverage: {
            provider: "istanbul",
            enabled: true,
            include: ["src/**/*"]
        }
    }
});
