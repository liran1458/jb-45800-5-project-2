import { configureStore } from "@reduxjs/toolkit";
import coinsReducer from "./coinsSlice";
import searchReducer from "./searchSlice";

export const store = configureStore({
    reducer: {
        coins: coinsReducer,
        search: searchReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
