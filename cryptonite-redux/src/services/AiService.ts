import axios from "axios";
import type AiCoinData from "../models/AiCoinData";
import { getSavedNvidiaApiKey } from "../utils/apiKey";

class AiService {
    public async getRecommendation(data: AiCoinData): Promise<string> {
        const apiKey = getSavedNvidiaApiKey();

        if (!apiKey) {
            throw new Error("NVIDIA API Key is missing.");
        }

        const prompt = `
Give a short crypto investment recommendation.

Rules:
- Answer in English.
- Clearly say whether it is worth buying or not.
- Provide a short explanation in 2-3 sentences.
- Be concise and professional.
- This is not financial advice.

Coin data:
${JSON.stringify(data, null, 2)}
`;

        const response = await axios.post(
            "https://integrate.api.nvidia.com/v1/chat/completions",
            {
                model: "meta/llama-3.1-8b-instruct",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.4,
                max_tokens: 300
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.choices[0].message.content;
    }
}

const aiService = new AiService();
export default aiService;
