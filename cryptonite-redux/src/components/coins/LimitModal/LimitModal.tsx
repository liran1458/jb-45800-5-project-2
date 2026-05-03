import type CoinModel from "../../../models/CoinModel";
import "./LimitModal.css";

interface LimitModalProps {
    selectedCoins: CoinModel[];
    newCoin: CoinModel;
    onReplace: (removeId: string) => void;
    onCancel: () => void;
}

function LimitModal(props: LimitModalProps) {
    return (
        <div className="modal-backdrop">
            <div className="limit-modal">
                <h2>Maximum Coins Reached</h2>

                <p>
                    You can select up to 5 coins. To add{" "}
                    {props.newCoin.symbol.toUpperCase()}, choose one coin to remove:
                </p>

                <div className="limit-list">
                    {props.selectedCoins.map(coin => (
                        <button key={coin.id} onClick={() => props.onReplace(coin.id)}>
                            ✖ {coin.symbol.toUpperCase()} - {coin.name}
                        </button>
                    ))}
                </div>

                <button className="cancel-button" onClick={props.onCancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default LimitModal;