import { h, render, useState, useEffect } from "../../../src/index";
import Triange from "./triangle";

function Run(props) {
    let [time, setTime] = useState(0);
    let t = (time / 1000) % 10;
    let scale = 1 + (t > 5 ? 10 - t : t) / 10;

    useEffect(() => {
        let start = Date.now();
        function update() {
            setTime(Date.now() - start);
            requestAnimationFrame(update);
        }
        let currentAnimation = requestAnimationFrame(update);
        () => {
            cancelAnimationFrame(currentAnimation);
        };
    }, []);

    return (
        <div
            shadowDom
            style={`
                position:absolute;
                transform-origin : 0 0;
                left:50%;
                top:50%;
                width:10px;
                height:10px;
                background:#eee;
                transform: scaleX( ${scale /
                    2.1}) scaleY(0.7) translateZ(0.1px);
            `}
        >
            <Triange x={0} y={0} s={1000} />
        </div>
    );
}

render(<Run />, document.querySelector("#app"));
