import { c, css, useProp } from "atomico";

export const DashboardStats = c(
    () => {
        const [total] = useProp("total");
        const [completed] = useProp("completed");
        const [inProgress] = useProp("inProgress");
        const [pending] = useProp("pending");

        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        // SVG circle stroke calculations
        const radius = 36;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (completionRate / 100) * circumference;

        return (
            <host shadowDom>
                <div class="stats-grid">
                    <div class="card progress-card">
                        <div class="progress-info">
                            <h3>Productivity</h3>
                            <p class="subtitle">Your daily goal progression</p>
                            <div class="stats-summary">
                                <span class="highlight">{completed}</span> of <span class="total">{total}</span> tasks completed
                            </div>
                        </div>
                        <div class="radial-container">
                            <svg class="radial-svg" viewBox="0 0 100 100">
                                <circle class="radial-bg" cx="50" cy="50" r={radius} />
                                <circle
                                    class="radial-bar"
                                    cx="50"
                                    cy="50"
                                    r={radius}
                                    style={`stroke-dasharray: ${circumference}; stroke-dashoffset: ${strokeDashoffset}`}
                                />
                            </svg>
                            <div class="radial-text">
                                <span class="percentage">{completionRate}%</span>
                            </div>
                        </div>
                    </div>

                    <div class="detail-cards">
                        <div class="card mini-card pending">
                            <span class="dot"></span>
                            <div class="card-content">
                                <span class="label">Pending</span>
                                <span class="value">{pending}</span>
                            </div>
                        </div>
                        <div class="card mini-card progress">
                            <span class="dot"></span>
                            <div class="card-content">
                                <span class="label">In Progress</span>
                                <span class="value">{inProgress}</span>
                            </div>
                        </div>
                        <div class="card mini-card completed">
                            <span class="dot"></span>
                            <div class="card-content">
                                <span class="label">Completed</span>
                                <span class="value">{completed}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </host>
        );
    },
    {
        props: {
            total: { type: Number, value: () => 0 },
            completed: { type: Number, value: () => 0 },
            inProgress: { type: Number, value: () => 0 },
            pending: { type: Number, value: () => 0 }
        },
        styles: css`
            :host {
                display: block;
                width: 100%;
            }
            .stats-grid {
                display: grid;
                grid-template-columns: 1.5fr 1fr;
                gap: 1.25rem;
                width: 100%;
            }
            @media (max-width: 768px) {
                .stats-grid {
                    grid-template-columns: 1fr;
                }
            }
            .card {
                background: #ffffff;
                border-radius: 16px;
                padding: 1.5rem;
                box-shadow: 0 4px 20px -2px rgba(156, 163, 175, 0.15), 0 2px 8px -1px rgba(156, 163, 175, 0.1);
                border: 1px solid rgba(229, 231, 235, 0.7);
                display: flex;
                position: relative;
                overflow: hidden;
            }
            .progress-card {
                justify-content: space-between;
                align-items: center;
                background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            }
            .progress-info {
                display: flex;
                flex-direction: column;
            }
            h3 {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 700;
                color: #0f172a;
            }
            .subtitle {
                margin: 0.25rem 0 1rem 0;
                font-size: 0.8125rem;
                color: #64748b;
            }
            .stats-summary {
                font-size: 0.875rem;
                color: #475569;
            }
            .stats-summary .highlight {
                font-weight: 700;
                color: #2563eb;
            }
            .stats-summary .total {
                font-weight: 600;
                color: #0f172a;
            }
            .radial-container {
                position: relative;
                width: 90px;
                height: 90px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .radial-svg {
                width: 100%;
                height: 100%;
                transform: rotate(-90deg);
            }
            .radial-bg {
                fill: none;
                stroke: #f1f5f9;
                stroke-width: 8;
            }
            .radial-bar {
                fill: none;
                stroke: url(#progressGrad);
                stroke: #2563eb; /* Fallback */
                stroke-width: 8;
                stroke-linecap: round;
                transition: stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .radial-text {
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .percentage {
                font-size: 1.125rem;
                font-weight: 700;
                color: #0f172a;
            }
            .detail-cards {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }
            .mini-card {
                padding: 0.875rem 1.25rem;
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            .dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                flex-shrink: 0;
            }
            .mini-card.pending .dot {
                background-color: #f59e0b;
                box-shadow: 0 0 8px #f59e0b;
            }
            .mini-card.progress .dot {
                background-color: #3b82f6;
                box-shadow: 0 0 8px #3b82f6;
            }
            .mini-card.completed .dot {
                background-color: #10b981;
                box-shadow: 0 0 8px #10b981;
            }
            .card-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
            }
            .label {
                font-size: 0.8125rem;
                font-weight: 500;
                color: #64748b;
            }
            .value {
                font-size: 1.125rem;
                font-weight: 700;
                color: #0f172a;
            }
        `
    }
);
