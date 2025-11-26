import { c, createRef } from "atomico";

function check() {
    return <host></host>;
}

const Check = c(check, {
    props: {
        message: String
    }
});

const ref = createRef<typeof Check>();

const R: InstanceType<typeof Check>[] = [];

R.at(0)?.message?.includes("any");

ref.current?.message?.includes("any");
