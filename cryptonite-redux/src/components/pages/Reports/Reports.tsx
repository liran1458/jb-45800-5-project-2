import { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    type ChartData,
    type ChartOptions
} from "chart.js";
import coinService from "../../../services/CoinService";
import { useAppSelector } from "../../../redux/hooks";
import Loader from "../../common/Loader/Loader"; 
import "./Reports.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ReportPoint {
    time: string;
    prices: Record<string, number>;
}

const chartColors = [
    "#f2a900",
    "#3b82f6",
    "#22c55e",
    "#ef4444",
    "#8b5cf6"
];

function Reports() {
    const selectedCoins = useAppSelector(state => state.coins.selectedCoins);
    const [points, setPoints] = useState<ReportPoint[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const symbols = useMemo(() => {
        return selectedCoins
            .map(coin => coin.symbol?.trim().toUpperCase())
            .filter(symbol => symbol.length > 0);
    }, [selectedCoins]);

    useEffect(() => {
        setPoints([]);
        setError("");

        if (symbols.length === 0) return;

        let isActive = true;

        async function loadPrices() {
            try {
                setIsLoading(true);
                const prices = await coinService.getLivePrices(symbols);

                if (!isActive) return;

                const newPrices: Record<string, number> = {};

                symbols.forEach(symbol => {
                    const price = prices[symbol]?.USD;
                    if (typeof price === "number") {
                        newPrices[symbol] = price;
                    }
                });

                if (Object.keys(newPrices).length === 0) {
                    setError("No live USD prices were returned for the selected coins.");
                    return;
                }

                setError("");

                setPoints(prev => [
                    ...prev.slice(-19),
                    {
                        time: new Date().toLocaleTimeString(),
                        prices: newPrices
                    }
                ]);
            }
            catch (err) {
                console.error(err);
                if (isActive) setError("Failed to load live reports data.");
            }
            finally {
                if (isActive) setIsLoading(false);
            }
        }

        loadPrices();
        const intervalId = window.setInterval(loadPrices, 1000);

        return () => {
            isActive = false;
            window.clearInterval(intervalId);
        };
    }, [symbols]);

    if (selectedCoins.length === 0) {
        return (
            <section className="reports">
                <h2>Live Reports</h2>
                <p>Please select coins on the Home page.</p>
            </section>
        );
    }

    const labels = points.map(point => point.time);

    const data: ChartData<"line", (number | null)[], string> = {
        labels,
        datasets: symbols.map((symbol, index) => {
            const color = chartColors[index % chartColors.length];

            return {
                label: `${symbol} / USD`,
                data: points.map(point => point.prices[symbol] ?? null),
                borderColor: color,
                backgroundColor: color,
                pointBackgroundColor: color,
                pointBorderColor: color,
                borderWidth: 2,
                pointRadius: 4,
                tension: 0.3,
                spanGaps: true
            };
        })
    };

    const options: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "bottom" },
            title: {
                display: true,
                text: `${symbols.join(", ")} to USD`
            }
        },
        scales: {
            y: {
                beginAtZero: false
            }
        }
    };

    return (
        <section className="reports">
            <h2>{symbols.join(", ")} to USD</h2>

            {isLoading && points.length === 0 && <Loader />}

            {error && <p className="reports-error">{error}</p>}

            <div className="chart-box">
                {points.length > 0
                    ? <Line data={data} options={options} />
                    : !isLoading && <p>Waiting for live report data...</p>
                }
            </div>

            <p className="chart-note">
                The chart updates every second and uses one API request for all selected coins.
            </p>
        </section>
    );
}

export default Reports;