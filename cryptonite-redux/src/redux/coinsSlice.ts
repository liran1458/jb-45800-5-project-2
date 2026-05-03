import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type CoinModel from "../models/CoinModel";
import coinService from "../services/CoinService";
import { SELECTED_COINS_KEY } from "../utils/storageKeys";

interface CoinsState {
    coins: CoinModel[];
    selectedCoins: CoinModel[];
    loading: boolean;
    error: string;
}

function loadSelectedCoins(): CoinModel[] {
    const json = localStorage.getItem(SELECTED_COINS_KEY);
    return json ? JSON.parse(json) : [];
}

function saveSelectedCoins(selectedCoins: CoinModel[]): void {
    localStorage.setItem(SELECTED_COINS_KEY, JSON.stringify(selectedCoins));
}

const initialState: CoinsState = {
    coins: [],
    selectedCoins: loadSelectedCoins(),
    loading: false,
    error: ""
};

export const fetchCoins = createAsyncThunk("coins/fetchCoins", async () => {
    return await coinService.getAllCoins();
});

const coinsSlice = createSlice({
    name: "coins",
    initialState,
    reducers: {
        addSelectedCoin: (state, action: PayloadAction<CoinModel>) => {
            if (state.selectedCoins.length >= 5) return;
            if (state.selectedCoins.some(c => c.id === action.payload.id)) return;
            state.selectedCoins.push(action.payload);
            saveSelectedCoins(state.selectedCoins);
        },
        removeSelectedCoin: (state, action: PayloadAction<string>) => {
            state.selectedCoins = state.selectedCoins.filter(c => c.id !== action.payload);
            saveSelectedCoins(state.selectedCoins);
        },
        replaceSelectedCoin: (state, action: PayloadAction<{ removeId: string; addCoin: CoinModel }>) => {
            state.selectedCoins = state.selectedCoins.filter(c => c.id !== action.payload.removeId);
            state.selectedCoins.push(action.payload.addCoin);
            saveSelectedCoins(state.selectedCoins);
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchCoins.pending, state => {
                state.loading = true;
                state.error = "";
            })
            .addCase(fetchCoins.fulfilled, (state, action) => {
                state.loading = false;
                state.coins = action.payload;
            })
            .addCase(fetchCoins.rejected, state => {
                state.loading = false;
                state.error = "Failed to load coins.";
            });
    }
});

export const { addSelectedCoin, removeSelectedCoin, replaceSelectedCoin } = coinsSlice.actions;
export default coinsSlice.reducer;
