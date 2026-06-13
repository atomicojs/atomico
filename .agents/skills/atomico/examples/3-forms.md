# Form Integration Guide

This guide covers creating custom inputs, checkboxes, and buttons that integrate natively with HTML `<form>` elements using ElementInternals and constraint validation.

## 1. Custom Form-Associated Input

To register a component as form-associated, you must set `form: true` in the component configuration. You can then sync value state with the parent form using `useFormProps` and handle validation using `useFormValidity`.

```tsx
import { c, useFormProps, useFormValidity } from "atomico";

export const CustomInput = c(
    () => {
        // 1. Synchronize value state with FormData
        const [value, setValue] = useFormProps();

        // 2. Register custom form validation
        const [errorMessage, validity] = useFormValidity(() => {
            if (value.length < 3) {
                return {
                    customError: true,
                    message: "Value must be at least 3 characters long."
                };
            }
            return { customError: false, message: "" };
        }, [value]);

        return (
            <host shadowDom>
                <div class="field-container">
                    <input
                        type="text"
                        value={value}
                        oninput={(e) => setValue(e.currentTarget.value)}
                        class={validity.valid ? "valid" : "invalid"}
                    />
                    {!validity.valid && <span class="error">{errorMessage}</span>}
                </div>
            </host>
        );
    },
    {
        form: true, // ✅ Required for form association
        props: {
            name: { type: String, value: () => "" },
            value: { type: String, value: () => "" }
        }
    }
);
```

---

## 2. Form Submit Custom Button

Natively, custom buttons nested inside a Shadow DOM do not submit their parent `<form>`. To achieve this, the custom button must trigger the submit event on the parent form programmatically.

```tsx
import { c, useInternals } from "atomico";

export const CustomSubmitButton = c(
    () => {
        const internals = useInternals();

        return (
            <host shadowDom>
                {/* ✅ GOOD: Inline handler utilizing parent form internals */}
                <button 
                    type="submit" 
                    onclick={() => {
                        if (internals.form) {
                            internals.form.requestSubmit();
                        }
                    }}
                >
                    <slot>Submit Form</slot>
                </button>
            </host>
        );
    },
    {
        form: true // ✅ Gives access to internals.form reference
    }
);
```
