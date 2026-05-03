import { useState } from "react";
import type CoinModel from "../../../models/CoinModel";
import type CoinInfoModel from "../../../models/CoinInfoModel";
import coinService from "../../../services/CoinService";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { addSelectedCoin, removeSelectedCoin, replaceSelectedCoin } from "../../../redux/coinsSlice";
import { formatCurrency } from "../../../utils/formatters";
import Loader from "../../common/Loader/Loader";
import LimitModal from "../LimitModal/LimitModal";
import "./CoinCard.css";

interface CoinCardProps {
    coin: CoinModel;
}

function CoinCard({ coin }: CoinCardProps) {
    const dispatch = useAppDispatch();
    const selectedCoins = useAppSelector(state => state.coins.selectedCoins);

    const checked = selectedCoins.some(c => c.id === coin.id);

    const [info, setInfo] = useState<CoinInfoModel | null>(null);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [isInfoLoading, setIsInfoLoading] = useState(false);
    const [infoError, setInfoError] = useState("");
    const [limitCoin, setLimitCoin] = useState<CoinModel | null>(null);

    async function toggleInfo() {
        if (isInfoOpen) {
            setIsInfoOpen(false);
            return;
        }

        setIsInfoOpen(true);

        if (info) return;

        try {
            setInfoError("");
            setIsInfoLoading(true);

            const data = await coinService.getCoinInfo(coin.id);
            setInfo(data);
        }
        catch (err) {
            console.error(err);
            setInfoError("Failed to load coin info.");
        }
        finally {
            setIsInfoLoading(false);
        }
    }

    function toggleSelected() {
        if (checked) {
            dispatch(removeSelectedCoin(coin.id));
            return;
        }

        if (selectedCoins.length >= 5) {
            setLimitCoin(coin);
            return;
        }

        dispatch(addSelectedCoin(coin));
    }

    function handleReplace(removeId: string) {
        dispatch(replaceSelectedCoin({ removeId, addCoin: coin }));
        setLimitCoin(null);
    }

    return (
        <>
            <div className={`coin-card ${isInfoOpen ? "info-open" : ""}`}>
                <div className="coin-top">
                    <img src={coin.image} alt={coin.name} />

                    <div className="coin-title">
                        <h3 title={coin.symbol.toUpperCase()}>{coin.symbol.toUpperCase()}</h3>
                        <p title={coin.name}>{coin.name}</p>
                    </div>

                    <label className="switch">
                        <input type="checkbox" checked={checked} onChange={toggleSelected} />
                        <span></span>
                    </label>
                </div>

                <button className="info-button" onClick={toggleInfo} disabled={isInfoLoading}>
                    {isInfoLoading ? "Loading..." : isInfoOpen ? "Close Info" : "More Info"}
                </button>

                {isInfoOpen && (
                    <div className="coin-info">
                        {isInfoLoading && <Loader />}

                        {!isInfoLoading && infoError && (
                            <p className="coin-info-error">{infoError}</p>
                        )}

                        {!isInfoLoading && info && (
                            <>
                                <p>{formatCurrency(info.usd, "USD")}</p>
                                <p>{formatCurrency(info.eur, "EUR")}</p>
                                <p>{formatCurrency(info.ils, "ILS")}</p>
                            </>
                        )}
                    </div>
                )}
            </div>

            {limitCoin && (
                <LimitModal
                    selectedCoins={selectedCoins}
                    newCoin={limitCoin}
                    onReplace={handleReplace}
                    onCancel={() => setLimitCoin(null)}
                />
            )}
        </>
    );
}

export default CoinCard;