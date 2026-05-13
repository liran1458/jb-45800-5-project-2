import { GEMINI_API_KEY } from "./storageKeys";

export function getSavedGeminiApiKey(): string {
    return localStorage.getItem(GEMINI_API_KEY) || "";
}

export function saveGeminiApiKey(apiKey: string): void {
    localStorage.setItem(GEMINI_API_KEY, apiKey.trim());
}

export function clearGeminiApiKey(): void {
    localStorage.removeItem(GEMINI_API_KEY);
}