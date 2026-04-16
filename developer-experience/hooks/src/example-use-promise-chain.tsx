import { c, usePromise, css } from "atomico";

export const EgUsePromiseChain = c(
    () => {
        // Primera petición: Solicita un recurso inicial
        const userRequest = usePromise(
            async () => {
                // Simulamos un retraso artificial para notar la diferencia de tiempos
                await new Promise((r) => setTimeout(r, 1000));
                const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
                return res.json();
            },
            []
        );

        // Segunda petición: Se dispara ÚNICAMENTE cuando termine la primera
        // Apalancamiento usando userRequest.endTime
        const postsRequest = usePromise(
            async () => {
                await new Promise((r) => setTimeout(r, 800)); // Retraso artificial
                const res = await fetch(
                    `https://jsonplaceholder.typicode.com/posts?userId=${userRequest.result.id}`
                );
                return res.json();
            },
            [userRequest.endTime], // Dependencia clave: si endTime cambia o se asigna, significa cumplimiento total del ciclo
            {
                // Solo empezamos si la primera cumplió exitosamente (evita encadenar tras un abort/error)
                autorun: !!userRequest.fulfilled,
                memo: true,
            }
        );

        return (
            <host shadowDom>
                <div class="container">
                    <h2>
                        Encadenamiento con <code>endTime</code>
                    </h2>
                    <p>
                        La segunda promesa solo inicia (y recibe datos de la primera) tras actualizarse el <i>endTime</i> del ciclo primario.
                    </p>

                    <div class="box">
                        <h3>👤 Paso 1: Cargar Usuario</h3>
                        {userRequest.pending && <span class="badge wait">⏳ Cargando...</span>}
                        {userRequest.fulfilled && (
                            <>
                                <span class="badge done">✅ Finalizado en {userRequest.endTime - userRequest.startTime}ms</span>
                                <p>
                                    <strong>{userRequest.result.name}</strong>
                                </p>
                            </>
                        )}
                    </div>

                    <div class="box">
                        <h3>📝 Paso 2: Cargar Posts del Usuario</h3>
                        {!userRequest.endTime && <span class="badge wait">🛑 Bloqueado esperando Paso 1</span>}
                        {postsRequest.pending && <span class="badge wait">⏳ Buscando posts...</span>}
                        {postsRequest.fulfilled && (
                            <>
                                <span class="badge done">✅ Finalizado en {postsRequest.endTime - postsRequest.startTime}ms</span>
                                <ul>
                                    {postsRequest.result.slice(0, 3).map((post: any) => (
                                        <li>{post.title}</li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </div>
            </host>
        );
    },
    {
        styles: css`
            .container {
                font-family: system-ui;
                max-width: 500px;
                margin: auto;
            }
            .box {
                margin-bottom: 20px;
                padding: 15px;
                border: 1px solid #ddd;
                border-radius: 8px;
                background: #f9f9f9;
            }
            .badge {
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                display: inline-block;
                background: #eee;
            }
            .badge.done {
                background: #d4edda;
                color: #155724;
            }
            .badge.wait {
                background: #fff3cd;
                color: #856404;
            }
        `,
    }
);

customElements.define("example-use-promise-chain", EgUsePromiseChain);
