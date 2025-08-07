import OpenAI from 'openai';
import { Embedder } from './Embedder';
import type { AppConfig } from '../../../types/AppConfig';

export class OpenAIEmbedder implements Embedder {
    private client: OpenAI;

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error('OpenAI API key is required. Please ensure it is provided through configuration.');
        }
        this.client = new OpenAI({ apiKey });
    }

    static fromConfig(config: AppConfig): OpenAIEmbedder {
        return new OpenAIEmbedder(config.openaiApiKey);
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