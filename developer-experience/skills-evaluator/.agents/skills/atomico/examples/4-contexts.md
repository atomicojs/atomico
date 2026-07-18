# Context Provider-Consumer Guide

This guide demonstrates how to share global state (like themes, user sessions, or settings) across DOM subtrees using Atomico's native `createContext` and `useContext` APIs.

## 1. Creating the Context

Use `createContext` to define a context with a default value. The returned object is a Custom Element constructor that serves as the Provider tag.

```tsx
import { createContext } from "atomico";

export interface ThemeContextDetail {
    theme: "light" | "dark";
    toggle: () => void;
}

// ✅ 1. Define the context with a default value
export const ThemeContext = createContext<ThemeContextDetail>({
    theme: "dark",
    toggle: () => {}
});
```

---

## 2. Mounting the Provider

To share state with a subtree, render the Context component in the parent element and pass the reactive state into the `value` property.

```tsx
import { c, useState } from "atomico";
import { ThemeContext, ThemeContextDetail } from "./theme-context.js";
import { ThemeConsumer } from "./theme-consumer.js";

export const AppLayout = c(() => {
    const [theme, setTheme] = useState<"light" | "dark">("dark");

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    const contextValue: ThemeContextDetail = {
        theme,
        toggle: toggleTheme
    };

    return (
        <host shadowDom>
            {/* ✅ 2. Wrap child elements inside the ThemeContext Provider tag */}
            <ThemeContext value={contextValue}>
                <div class="app-body">
                    <ThemeConsumer />
                </div>
            </ThemeContext>
        </host>
    );
});
```

---

## 3. Consuming Context in Subcomponents

Any child element nested inside the provider's subtree can access the shared values using `useContext` with the Context constructor.

```tsx
import { c, useContext } from "atomico";
import { ThemeContext } from "./theme-context.js";

export const ThemeConsumer = c(() => {
    // ✅ 3. Consume context using the useContext hook
    const themeDetails = useContext(ThemeContext);

    return (
        <host shadowDom>
            <div class={`card theme-${themeDetails.theme}`}>
                <p>Current theme: <strong>{themeDetails.theme}</strong></p>
                <button onclick={themeDetails.toggle}>Toggle Theme</button>
            </div>
        </host>
    );
});
```
