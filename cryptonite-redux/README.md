# Cryptonite

A React + TypeScript cryptocurrency tracking application.

## Features

- View top cryptocurrencies from CoinGecko
- Search coins by name or symbol
- Select up to 5 favorite coins
- Live Reports with real-time charts
- AI Recommendations using Google Gemini API
- More Info with API caching
- Responsive design and loaders

## Technologies

- React
- TypeScript
- Redux Toolkit
- Axios
- Chart.js
- Google Gemini API

## AI Integration

The AI Recommendation page uses the Google Gemini API.

Users enter their own API key, which is stored securely in the browser `localStorage`.

If the AI request fails, the application automatically falls back to a local recommendation.

## Run Locally

```bash
npm install
npm run dev