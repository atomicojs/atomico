export const circle = (
    <svg height="100" width="100">
        <circle
            cx="50"
            cy="50"
            r="40"
            stroke="black"
            stroke-width="3"
            fill="red"
        />
    </svg>
);

export const rect = (
    <svg width="400" height="110">
        <rect
            width="300"
            height="100"
            style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)"
        />
    </svg>
);

export const ellipse = (
    <svg height="140" width="500">
        <ellipse
            cx="200"
            cy="80"
            rx="100"
            ry="50"
            style="fill:yellow;stroke:purple;stroke-width:2"
        />
    </svg>
);

export const line = (
    <svg height="210" width="500">
        <line
            x1="0"
            y1="0"
            x2="200"
            y2="200"
            style="stroke:rgb(255,0,0);stroke-width:2"
        />
    </svg>
);

export const polygon = (
    <svg height="210" width="500">
        <polygon
            points="200,10 250,190 160,210"
            style="fill:lime;stroke:purple;stroke-width:1"
        />
    </svg>
);

export const polyline = (
    <svg height="200" width="500">
        <polyline
            points="20,20 40,25 60,40 80,120 120,140 200,180"
            style="fill:none;stroke:black;stroke-width:3"
        />
    </svg>
);

export const path = (
    <svg height="210" width="400">
        <path d="M150 0 L75 200 L225 200 Z" />
    </svg>
);

export const text = (
    <svg height="90" width="200">
        <text x="10" y="20" style="fill:red;">
            Several lines:
            <tspan x="10" y="45">
                First line.
            </tspan>
            <tspan x="10" y="70">
                Second line.
            </tspan>
        </text>
    </svg>
);

export const stroke = (
    <svg height="80" width="300">
        <g fill="none" stroke="black" stroke-width="4">
            <path stroke-dasharray="5,5" d="M5 20 l215 0" />
            <path stroke-dasharray="10,10" d="M5 40 l215 0" />
            <path stroke-dasharray="20,10,5,5,5,10" d="M5 60 l215 0" />
        </g>
    </svg>
);

export const svgFeGaussianBlur = (
    <svg height="110" width="110">
        <defs>
            <filter id="f1" x="0" y="0">
                <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
            </filter>
        </defs>
        <rect
            width="90"
            height="90"
            stroke="green"
            stroke-width="3"
            fill="yellow"
            filter="url(#f1)"
        />
    </svg>
);

export const svgDropShadow = (
    <svg height="140" width="140">
        <defs>
            <filter id="f4" x="0" y="0" width="200%" height="200%">
                <feOffset result="offOut" in="SourceGraphic" dx="20" dy="20" />
                <feColorMatrix
                    result="matrixOut"
                    in="offOut"
                    // type="matrix"
                    values="0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 1 0"
                />
                <feGaussianBlur
                    result="blurOut"
                    in="matrixOut"
                    stdDeviation="10"
                />
                <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
            </filter>
        </defs>
        <rect
            width="90"
            height="90"
            stroke="green"
            stroke-width="3"
            fill="yellow"
            filter="url(#f4)"
        />
    </svg>
);
