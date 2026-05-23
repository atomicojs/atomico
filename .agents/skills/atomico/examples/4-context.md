# Example: Context API

Using `createContext` and `useContext` to share state without prop drilling.

> [!IMPORTANT]
> In Atomico, context values **must always be objects**. Do not use primitive values (strings, numbers, booleans) directly as the context value, because Atomico relies on object references for reactive updates across the DOM tree.

```tsx
import { c, createContext, useContext, useProp } from "atomico";

// 1. Create the Context with a default object
export const ThemeContext = createContext({ theme: "light" });

// 2. Create the Provider Component
export const ThemeProvider = c(
    ({ theme }) => {
        // useProp to expose the value attribute, so parents can change the theme
        const [currentTheme] = useProp("theme");
        
        return (
            <host shadowDom>
                {/* Provide the object to the context */}
                <ThemeContext value={{ theme: currentTheme }}>
                    <slot></slot>
                </ThemeContext>
            </host>
        );
    },
    {
        props: {
            theme: { type: String, value: () => "light" }
        }
    }
);

customElements.define("theme-provider", ThemeProvider);

// 3. Create a Consumer Component
export const ThemeConsumer = c(
    () => {
        // Consume the context object
        const ctx = useContext(ThemeContext);
        
        return (
            <host shadowDom>
                <div class={`box ${ctx.theme}`}>
                    Current Theme: {ctx.theme}
                </div>
            </host>
        );
    }
);

customElements.define("theme-consumer", ThemeConsumer);
```
