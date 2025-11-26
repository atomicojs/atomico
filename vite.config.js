import { defineConfig } from "vite";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
    test: {
        include: ["./src/**/*.test.{tsx,jsx,ts}"],
        browser: {
            provider: playwright(),
            instances: [{ browser: "chromium" }],
            headless: true
        },
        coverage: {
            provider: "v8",
            enabled: true,
            include: ["src/**/*"]
        }
    }
});
