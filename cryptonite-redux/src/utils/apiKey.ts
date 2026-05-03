import { NVIDIA_API_KEY } from "./storageKeys";

export function getSavedNvidiaApiKey(): string {
    return localStorage.getItem(NVIDIA_API_KEY) || "";
}

export function saveNvidiaApiKey(apiKey: string): void {
    localStorage.setItem(NVIDIA_API_KEY, apiKey.trim());
}

export function clearNvidiaApiKey(): void {
    localStorage.removeItem(NVIDIA_API_KEY);
}
