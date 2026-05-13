import axios from "axios";
import type AiCoinData from "../models/AiCoinData";
import { getSavedGeminiApiKey } from "../utils/apiKey";

class AiService {
    public async getRecommendation(data: AiCoinData): Promise<string> {
        const apiKey = getSavedGeminiApiKey();

        if (!apiKey) {
            return this.getFallbackRecommendation(data);
        }

        try {
            const prompt = `
Give a short crypto investment recommendation.

Rules:
- Answer in English.
- Clearly say whether it is worth buying or not.
- Provide a short explanation (2-3 sentences).
- Be concise and professional.
- This is not financial advice.

Coin data:
${JSON.stringify(data, null, 2)}
`;

            const response = await axios.post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
                {
                    contents: [
                        {
                            parts: [{ text: prompt }]
                        }
                    ]
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-goog-api-key": apiKey
                    }
                }
            );

            return response.data.candidates[0].content.parts[0].text;
        }
        catch (err) {
            console.error("Gemini API failed:", err);
            return this.getFallbackRecommendation(data);
        }
    }

    private getFallbackRecommendation(data: AiCoinData): string {
        const change30 = data.price_change_percentage_30d_in_currency ?? 0;

        if (change30 > 5) {
            return "It might be worth buying. The coin shows positive momentum over the last 30 days. However, crypto is volatile, so this is not financial advice.";
        }

        if (change30 < -5) {
            return "It is not recommended to buy right now. The coin has shown negative movement over the last 30 days. Consider waiting for a more stable trend.";
        }

        return "The recommendation is neutral. The coin does not show a strong trend, so it may be better to keep monitoring it before making a decision.";
    }
}

const aiService = new AiService();
export default aiService;