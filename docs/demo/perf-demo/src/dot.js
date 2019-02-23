import { h, useEffect, useState } from "../../../../src/index";

export default function Dot({ s, y, x, size }) {
    s = size * 1.3;
    let [count, setCount] = useState(0);
    let [hover, setHover] = useState();

    useEffect(() => {
        setInterval(() => {
            count = count > 9 ? 0 : count;
            setCount(++count);
        }, 1000);
    }, []);

    return (
        <div
            style={`
                position: absolute;
                font: normal 15px sans-serif;
                text-align: center;
                cursor: pointer;
                width: ${s}px;
                height: ${s}px;
                left: ${x}px;
                top: ${y}px;
                border-radius: ${s / 2}px;
                line-height: ${s}px;
                background: ${hover ? "#ff0" : "#61dafb"}
            `}
            onmouseenter={() => setHover(true)}
            onmouseleave={() => setHover(false)}
        >
            {count}
        </div>
    );
}
