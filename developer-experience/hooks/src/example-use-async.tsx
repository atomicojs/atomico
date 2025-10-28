import { c, useAsync } from "atomico";

export const EgUseAsync = c(() => {
    const result = useAsync(
        async (): Promise<
            {
                albumId: number;
                id: number;
                title: string;
                url: string;
                thumbnailUrl: string;
            }[]
        > =>
            await fetch("https://jsonplaceholder.typicode.com/photos").then(
                (res) => res.json()
            ),
        []
    );

    return (
        <host>
            <ul>
                {result.map((item) => (
                    <li>{item.title}</li>
                ))}
            </ul>
        </host>
    );
});

customElements.define("example-use-async", EgUseAsync);
