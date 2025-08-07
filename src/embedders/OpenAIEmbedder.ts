import OpenAI from 'openai';
import { Embedder } from './Embedder.js';

export class OpenAIEmbedder implements Embedder {
    private client: OpenAI;

    constructor(apiKey?: string) {
        this.client = new OpenAI({
            apiKey: apiKey || process.env.OPENAI_API_KEY
        });
    }

    async getEmbedding(text: string): Promise<number[]> {
        const response = await this.client.embeddings.create({
            model: "text-embedding-3-small",
            input: text,
            encoding_format: "float"
        });

        return response.data[0].embedding;
    }
}