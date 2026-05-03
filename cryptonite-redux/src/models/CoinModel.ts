export default interface CoinModel {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap?: number;
    total_volume?: number;
    price_change_percentage_30d_in_currency?: number;
    price_change_percentage_60d_in_currency?: number;
    price_change_percentage_200d_in_currency?: number;
}
