import { h, render, useEffect, useState } from "../../../src/index";

function Table(props) {
    return (
        <table class="table table-striped latest-data">
            <tbody>
                {props.dbs.map(data => (
                    <tr>
                        <td class="dbname">{data.dbname}</td>

                        <td class="query-count">
                            <span class={data.lastSample.countClassName}>
                                {data.lastSample.nbQueries}
                            </span>
                        </td>
                        {data.lastSample.topFiveQueries.map(data => (
                            <td class={"Query " + data.elapsedClassName}>
                                {data.formatElapsed}
                                <div class="popover left">
                                    <div class="popover-content">
                                        {data.query}
                                    </div>
                                    <div class="arrow" />
                                </div>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

perfMonitor.startFPSMonitor();
perfMonitor.startMemMonitor();
perfMonitor.initProfiler("view update");

function getData() {
    return ENV.generateData().toArray();
}

function Rerender() {
    perfMonitor.startProfile("view update");
    let [state, setState] = useState(getData);
    useEffect(() => {
        function loop() {
            setState(getData());
            setTimeout(loop, ENV.timeout);
        }
        loop();
    }, []);
    useEffect(() => {
        perfMonitor.endProfile("view update");
    });
    return <Table dbs={state} />;
}

render(<Rerender />, document.getElementById("body"));
