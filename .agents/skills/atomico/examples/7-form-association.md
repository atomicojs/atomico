# Example: Form Association & Custom Controls

A complete reference showing how an Atomico component acts as a native form control using `ElementInternals` and form hooks.

```tsx
import { c, useRef, useFormProps, useFormValidity, useFormSubmit, useFormReset, css } from "atomico";
import { delegateValidity } from "atomico/utils";

export const ValidatedInput = c(
    ({ name, label }) => {
        // 1. useFormProps: Bidirectionally syncs the "name" and "value" properties with the parent form
        const [value = "", setValue] = useFormProps();
        const inputRef = useRef<HTMLInputElement>();

        // 2. useFormValidity: Binds native browser constraint validation
        const [, validity] = useFormValidity(
            () => delegateValidity(inputRef.current),
            [value]
        );

        // 3. useFormSubmit: Listen to the parent form submit event directly
        useFormSubmit((event) => {
            console.log(`Submitting value for ${name}:`, value);
        });

        // 4. useFormReset: Register clean-up logic when the form resets
        useFormReset(() => {
            setValue(""); // Clear component state
        });

        return (
            <host shadowDom={{ delegatesFocus: true }}>
                <label>
                    <span class="label-text">
                        {!validity.valid && "🔴 "}
                        {label}
                    </span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        oninput={({ currentTarget }) => setValue(currentTarget.value)}
                        required
                        minLength={3}
                    />
                </label>
            </host>
        );
    },
    {
        form: true, // 👈 CRITICAL: Registers form association with the browser
        props: {
            name: String,
            value: String,
            label: { type: String, value: () => "Input Label" }
        },
        styles: css`
            :host { display: block; margin-bottom: 1rem; }
            label { display: grid; gap: 0.25rem; }
            .label-text { font-size: 0.875rem; font-weight: 600; }
            input { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
        `
    }
);

customElements.define("validated-input", ValidatedInput);
```
