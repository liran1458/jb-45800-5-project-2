import { useEffect, useState } from "react";
import Loader from "../../common/Loader/Loader";
import aiService from "../../../services/AiService";
import coinService from "../../../services/CoinService";
import { useAppSelector } from "../../../redux/hooks";
import {
    clearGeminiApiKey,
    getSavedGeminiApiKey,
    saveGeminiApiKey
} from "../../../utils/apiKey";
import "./Ai.css";

function Ai() {
    const selectedCoins = useAppSelector(state => state.coins.selectedCoins);

    const [apiKey, setApiKey] = useState("");
    const [recommendations, setRecommendations] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        setApiKey(getSavedGeminiApiKey());
    }, []);

    function handleSaveKey() {
        setError("");
        setMessage("");

        if (!apiKey.trim()) {
            setError("Please enter your Gemini API key.");
            return;
        }

        saveGeminiApiKey(apiKey.trim());
        setMessage("API key saved in localStorage.");
    }

    function handleClearKey() {
        clearGeminiApiKey();
        setApiKey("");
        setMessage("API key removed.");
        setError("");
    }

    async function getOneRecommendation(coinId: string) {
        try {
            setError("");
            setMessage("");
            setLoading(true);

            const coinData = await coinService.getAiCoinData(coinId);
            const recommendation = await aiService.getRecommendation(coinData);

            setRecommendations(prev => ({
                ...prev,
                [coinId]: recommendation
            }));
        }
        catch {
            setError("Failed to get AI recommendation.");
        }
        finally {
            setLoading(false);
        }
    }

    async function getAllRecommendations() {
        try {
            setError("");
            setMessage("");
            setLoading(true);

            const results = await Promise.all(
                selectedCoins.map(async coin => {
                    const coinData = await coinService.getAiCoinData(coin.id);
                    const recommendation = await aiService.getRecommendation(coinData);

                    return {
                        coinId: coin.id,
                        recommendation
                    };
                })
            );

            const nextRecommendations: Record<string, string> = {};

            results.forEach(result => {
                nextRecommendations[result.coinId] = result.recommendation;
            });

            setRecommendations(nextRecommendations);
        }
        catch {
            setError("Failed to get AI recommendations.");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <section className="ai-page">
            <h2>AI Recommendation</h2>

            <div className="api-key-box">
                <label>Gemini API Key</label>

                <input
                    type="password"
                    placeholder="Paste your Gemini API key here"
                    value={apiKey}
                    disabled={loading}
                    onChange={e => setApiKey(e.target.value)}
                />

                <div className="api-key-actions">
                    <button disabled={loading} onClick={handleSaveKey}>
                        Save Key
                    </button>

                    <button
                        disabled={loading}
                        className="secondary"
                        onClick={handleClearKey}
                    >
                        Clear Key
                    </button>
                </div>

                <p>The key is saved only in your browser localStorage.</p>
            </div>

            {selectedCoins.length === 0 && (
                <div className="empty-state">
                    <h3>No coins selected</h3>
                    <p>Please select coins on the Home page.</p>
                </div>
            )}

            {selectedCoins.length > 0 && (
                <button
                    disabled={loading}
                    className="all-button"
                    onClick={getAllRecommendations}
                >
                    {loading ? "Loading..." : "Get All Recommendations"}
                </button>
            )}

            {loading && <Loader />}
            {message && <p className="ai-message">{message}</p>}
            {error && <p className="ai-error">{error}</p>}

            <div className="ai-list">
                {selectedCoins.map(coin => (
                    <div className="ai-card" key={coin.id}>
                        <img src={coin.image} alt={coin.name} />

                        <h3>{coin.symbol.toUpperCase()} Recommendation</h3>
                        <p>{coin.name}</p>

                        <button
                            disabled={loading}
                            onClick={() => getOneRecommendation(coin.id)}
                        >
                            {loading ? "Loading..." : "Get Recommendation"}
                        </button>

                        {recommendations[coin.id] && (
                            <p className="recommendation">
                                {recommendations[coin.id]}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Ai;