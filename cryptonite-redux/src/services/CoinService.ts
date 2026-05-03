import axios from "axios";
import type CoinModel from "../models/CoinModel";
import type CoinInfoModel from "../models/CoinInfoModel";
import type LivePriceModel from "../models/LivePriceModel";

class CoinService {
    public async getAllCoins(): Promise<CoinModel[]> {
        const response = await axios.get<CoinModel[]>("https://api.coingecko.com/api/v3/coins/markets", {
            params: {
                vs_currency: "usd",
                order: "market_cap_desc",
                per_page: 100,
                page: 1,
                sparkline: false
            }
        });
        return response.data;
    }

    public async getCoinInfo(coinId: string): Promise<CoinInfoModel> {
        const cacheKey = `coin-info-${coinId}`;
        const cached = sessionStorage.getItem(cacheKey);

        // אם יש ב-cache → תחזיר בלי API
        if (cached) {
            return JSON.parse(cached);
        }

        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`);

        const info: CoinInfoModel = {
            usd: response.data.market_data.current_price.usd,
            eur: response.data.market_data.current_price.eur,
            ils: response.data.market_data.current_price.ils
        };

        
        sessionStorage.setItem(cacheKey, JSON.stringify(info));

        return info;
    }

    public async getLivePrices(symbols: string[]): Promise<LivePriceModel> {
        const joinedSymbols = symbols.join(",");
        const response = await axios.get<LivePriceModel>("https://min-api.cryptocompare.com/data/pricemulti", {
            params: { tsyms: "USD", fsyms: joinedSymbols }
        });
        return response.data;
    }

    public async getAiCoinData(coinId: string) {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
            params: { market_data: true }
        });
        const coin = response.data;
        return {
            name: coin.name,
            current_price_usd: coin.market_data.current_price.usd || 0,
            market_cap_usd: coin.market_data.market_cap.usd || 0,
            volume_24h_usd: coin.market_data.total_volume.usd || 0,
            price_change_percentage_30d_in_currency: coin.market_data.price_change_percentage_30d_in_currency?.usd || 0,
            price_change_percentage_60d_in_currency: coin.market_data.price_change_percentage_60d_in_currency?.usd || 0,
            price_change_percentage_200d_in_currency: coin.market_data.price_change_percentage_200d_in_currency?.usd || 0
        };
    }
}

const coinService = new CoinService();
export default coinService;
