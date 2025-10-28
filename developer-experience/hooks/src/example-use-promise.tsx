import { c, usePromise } from "atomico";

export const EgUsePromise = c(() => {
    const promise = usePromise(
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
                {promise.fulfilled ? (
                    promise.result.map((item) => <li>{item.title}</li>)
                ) : (
                    <li>Loading...</li>
                )}
            </ul>
        </host>
    );
});

customElements.define("example-use-promise", EgUsePromise);
