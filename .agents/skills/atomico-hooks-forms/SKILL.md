---
name: atomico-hooks-forms
description: >
  Use form-associated hooks: useFormProps, useFormValue, useFormValidity,
  useFormSubmit, useFormReset, useFormAssociated, useFormDisabled, and
  useInternals. Triggers when the user needs to create custom form elements,
  integrate with HTML form validation, track form state, or build accessible
  form controls as web components.
license: MIT
compatibility: "Atomico >=1.79, browsers with ElementInternals support"
metadata:
  category: hooks
  priority: medium
---

# Form-Associated Hooks

These hooks enable Atomico components to participate as native form elements
using the `ElementInternals` API. They require `form: true` in the component
configuration.

## Prerequisites

```tsx
const MyInput = c(
    () => { /* ... */ },
    {
        form: true,  // ← Required to enable form association
        props: {
            name: String,
            value: String
        }
    }
);
```

---

## `useInternals` — Access ElementInternals

Returns the `ElementInternals` object for the host element. This is the
low-level hook that other form hooks build upon.

```tsx
import { c, useInternals } from "atomico";

const MyInput = c(
    () => {
        const internals = useInternals();
        // internals.setFormValue, internals.setValidity, etc.
        return <host />;
    },
    { form: true }
);
```

> **Note**: `attachInternals()` is called once per element instance and cached.

---

## `useFormProps` — Bidirectional Form Value

Combines `useProp` for both `name` and `value` props with automatic
`FormData` submission and form reset handling.

### API

```ts
const [value, setValue] = useFormProps(propName?, propValue?);
// Defaults: propName = "name", propValue = "value"
```

### Usage

```tsx
import { c, useFormProps, useFormValidity, useRef, css } from "atomico";
import { delegateValidity } from "atomico/utils";

const MyInput = c(
    ({ name }) => {
        const [value = "", setValue] = useFormProps();
        const inputRef = useRef<HTMLInputElement>();

        const [, validity] = useFormValidity(
            () => delegateValidity(inputRef.current),
            [value]
        );

        return (
            <host shadowDom={{ delegatesFocus: true }}>
                <label>
                    <span>
                        {!validity.valid && "🔴"}
                        {name}
                    </span>
                    <input
                        value={value}
                        ref={inputRef}
                        oninput={({ currentTarget }) => {
                            setValue(currentTarget.value);
                        }}
                        required
                        minLength={3}
                    />
                </label>
            </host>
        );
    },
    {
        form: true,
        props: {
            name: String,
            value: String
        },
        styles: css`
            :host { display: block; }
            label { display: grid; padding: 0.5rem 0; }
        `
    }
);
```

### What it Does

1. Reads `name` and `value` via `useProp`
2. On value change, calls `internals.setFormValue()` with the name/value pair
3. On form reset, clears the value to `null`

---

## `useFormValidity` — Form Validation

Integrates with the browser's native constraint validation API through
`ElementInternals.setValidity()`.

### API

```ts
const [message, validity] = useFormValidity(callback, args);
```

### Parameters

- `callback`: Returns `{ message, report?, ...ValidityStateFlags }`
- `args`: Dependency array — validation re-runs when these change

### With `delegateValidity` Utility

The `delegateValidity` utility (from `atomico/utils`) reads validation state
from a native input and formats it for `useFormValidity`:

```tsx
import { delegateValidity } from "atomico/utils";

const [message, validity] = useFormValidity(
    () => delegateValidity(inputRef.current),
    [value]
);

// validity.valid — boolean
// message — current validation message
```

### Custom Validation

```tsx
const [message, validity] = useFormValidity(
    () => ({
        message: value.length < 3 ? "Minimum 3 characters" : "",
        customError: value.length < 3,
        report: true  // Auto-report on invalid
    }),
    [value]
);
```

### Validation on Submit

`useFormValidity` automatically hooks into form submit events. When the form
is submitted:

1. `state.report` is set to `true`
2. The validation callback re-runs
3. If invalid, `event.preventDefault()` is called
4. `reportValidity()` shows the native validation UI

---

## `useFormValue` — Manual FormData Control

Lower-level hook for manually managing form data submission values.

### API

```ts
const [value, setValue] = useFormValue(propName: string);
```

### Usage

```tsx
const [value, setValue] = useFormValue("rating");

// Sets both the display state and the FormData value
setValue(5);
```

---

## `useFormSubmit` — Listen to Form Submit

Attaches a listener to the associated form's `submit` event.

```tsx
import { c, useFormSubmit } from "atomico";

const MyInput = c(
    () => {
        useFormSubmit((event) => {
            console.log("Form submitted!", event);
        });
        return <host />;
    },
    { form: true }
);
```

---

## `useFormReset` — Handle Form Reset

Registers a callback for when the form is reset.

```tsx
import { c, useFormReset, useProp } from "atomico";

const MyInput = c(
    () => {
        const [value, setValue] = useProp<string>("value");

        useFormReset(() => {
            setValue(null);  // Clear on reset
        });

        return <host />;
    },
    { form: true, props: { value: String } }
);
```

---

## `useFormAssociated` — Form Association Callback

Fires when the component is associated with a form element.

```tsx
useFormAssociated((form) => {
    console.log("Associated with form:", form);
});
```

---

## `useFormDisabled` — Disabled State Callback

Fires when the component's disabled state changes via `<fieldset disabled>`.

```tsx
useFormDisabled((disabled) => {
    console.log("Disabled:", disabled);
});
```

---

## Complete Login Form Example

```tsx
import { c, useFormProps, useFormValidity, useRef, useState, css } from "atomico";
import { delegateValidity } from "atomico/utils";

const MyInput = c(
    ({ name }) => {
        const [value = "", setValue] = useFormProps();
        const ref = useRef<HTMLInputElement>();
        const [, validity] = useFormValidity(
            () => delegateValidity(ref.current),
            [value]
        );

        return (
            <host shadowDom={{ delegatesFocus: true }}>
                <label>
                    <span>{!validity.valid && "🔴"} {name}</span>
                    <input
                        value={value}
                        ref={ref}
                        oninput={({ currentTarget }) => setValue(currentTarget.value)}
                        required
                        minLength={3}
                    />
                </label>
            </host>
        );
    },
    {
        form: true,
        props: { name: String, value: String },
        styles: css`
            :host { display: block; }
            label { display: grid; padding: 0.5rem 0; }
        `
    }
);

const MyLogin = c(
    () => {
        const [data, setData] = useState();
        return (
            <host shadowDom>
                <form oninput={({ currentTarget }) => {
                    setData(Object.fromEntries(
                        new FormData(currentTarget as HTMLFormElement)
                    ));
                }}>
                    <MyInput name="user" />
                    <MyInput name="password" />
                    <button type="submit">Login</button>
                </form>
                <code>{JSON.stringify(data)}</code>
            </host>
        );
    },
    { styles: css`:host { display: grid; }` }
);
```
