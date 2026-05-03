import { useEffect } from "react";
import CoinCard from "../../coins/CoinCard/CoinCard";
import Loader from "../../common/Loader/Loader";
import { fetchCoins } from "../../../redux/coinsSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import "./Home.css";

function Home() {
    const dispatch = useAppDispatch();
    const { coins, loading, error } = useAppSelector(state => state.coins);
    const searchText = useAppSelector(state => state.search.searchText);

    useEffect(() => {
        if (coins.length === 0) dispatch(fetchCoins());
    }, [dispatch, coins.length]);

    const lowerSearch = searchText.toLowerCase();
    const filteredCoins = coins.filter(coin =>
        coin.symbol.toLowerCase().includes(lowerSearch) ||
        coin.name.toLowerCase().includes(lowerSearch)
    );

    return (
        <section className="home">
            <div className="hero"><h2>Cryptonite</h2></div>

            {loading && <Loader />}

            {!loading && error && <p className="error">{error}</p>}

            {!loading && !error && (
                <div className="coins-grid">
                    {filteredCoins.map(coin => (
                        <CoinCard key={coin.id} coin={coin} />
                    ))}
                </div>
            )}
        </section>
    );
}

export default Home;
