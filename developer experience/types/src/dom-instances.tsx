import { c, createRef } from "atomico";

function check() {
    return <host></host>;
}

check.props = {
    message: String
};

const Check = c(check);

const ref = createRef<typeof Check>();

const R: InstanceType<typeof Check>[] = [];

R.at(0)?.message?.includes("any");

ref.current?.message?.includes("any");
