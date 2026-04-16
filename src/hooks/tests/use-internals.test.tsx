import { expect, describe, it, vi } from "vitest";
import { c } from "../../element/custom-element.js";
import { 
    useInternals, 
    useFormProps, 
    useFormValue, 
    useFormValidity, 
    useFormSubmit 
} from "../custom-hooks/use-internals.js";
import { live } from "../../tests/element.test.js";
import { delay } from "./utils.js";

describe("useInternals", () => {
    it("useInternals provides ElementInternals", async () => {
        let internals;
        const Child = c(() => {
            internals = useInternals();
            return <host />;
        });
        const child = live(Child);
        document.body.append(child);
        await delay();
        
        expect(internals).toBeDefined();
        // Should have attachInternals returned object methods
        expect(internals.setFormValue).toBeDefined();
        child.remove();
    });

    it("useFormProps syncs name and value with internals", async () => {
        let formProps;
        const Child = c(() => {
            const [value, setValue] = useFormProps("name", "value");
            formProps = { value, setValue };
            return <host />;
        }, {
            props: {
                name: { type: String, value: () => "test-input" },
                value: { type: String, value: () => "test-value" }
            }
        });
        // Chromium needs formAssociated to true to push form values
        Child.formAssociated = true;
        
        const child = live(Child);
        const form = document.createElement("form");
        document.body.append(form);
        form.append(child);

        await delay();
        
        expect(formProps.value).toBe("test-value");
        expect(new FormData(form).get("test-input")).toBe("test-value");
        
        formProps.setValue("new-value");
        await delay();
        
        expect(new FormData(form).get("test-input")).toBe("new-value");
        
        form.remove();
    });

    it("useFormValue handles generic form value", async () => {
        let formValueApi;
        const Child = c(() => {
            const [value, setValue] = useFormValue("field1");
            formValueApi = { value, setValue };
            return <host />;
        });
        Child.formAssociated = true;
        
        const child = live(Child);
        const form = document.createElement("form");
        document.body.append(form);
        form.append(child);
        
        await delay();
        
        formValueApi.setValue("hello");
        await delay();
        
        expect(formValueApi.value).toBe("hello");
        expect(new FormData(form).get("field1")).toBe("hello");
        
        form.remove();
    });

    it("useFormValidity handles validity state", async () => {
        let validityApi;
        const Child = c(({ required }) => {
            const [message, validity] = useFormValidity(() => {
                if (required) {
                    return { message: "Value is required", valueMissing: true };
                }
                return { message: "", valid: true };
            }, [required]);
            
            validityApi = { message, validity };
            return <host />;
        }, {
            props: { required: Boolean }
        });
        Child.formAssociated = true;
        
        const child = live(Child);
        const form = document.createElement("form");
        document.body.append(form);
        form.append(child);
        
        await delay();
        
        expect(validityApi.validity.valid).toBe(true);
        
        // Trigger validation failure
        child.required = true;
        await delay();
        
        expect(validityApi.message).toBe("Value is required");
        expect(validityApi.validity.valueMissing).toBe(true);
        expect(validityApi.validity.valid).toBe(false);
        
        form.remove();
    });

    it("useFormSubmit handles submit events", async () => {
        const spy = vi.fn((e) => e.preventDefault());
        const Child = c(() => {
            useFormSubmit(spy);
            return <host />;
        });
        Child.formAssociated = true;
        
        const child = live(Child);
        const form = document.createElement("form");
        document.body.append(form);
        form.append(child);
        
        await delay();
        
        form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        await delay();
        
        expect(spy).toHaveBeenCalled();
        form.remove();
    });
});
