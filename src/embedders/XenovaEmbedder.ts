import { pipeline, Pipeline } from '@xenova/transformers';
import { Embedder } from './Embedder.js';

export class XenovaEmbedder implements Embedder {
    private embedder: Pipeline | null = null;

    private async initializeEmbedder(): Promise<Pipeline> {
        if (!this.embedder) {
            this.embedder = await pipeline(
                'feature-extraction',
                'Xenova/nomic-embed-text-v1'
            );
        }
        return this.embedder;
    }

    async getEmbedding(text: string): Promise<number[]> {
        const embedder = await this.initializeEmbedder();
        const results = await embedder(text, { pooling: 'mean', normalize: true });
        return Array.from(results.data);
    }
}