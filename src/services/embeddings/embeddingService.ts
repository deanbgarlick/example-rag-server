import { Embedder } from './embedders/Embedder';

let embedder: Embedder | null = null;

/**
 * Initialize the embedding service with a configured embedder
 */
export function initializeEmbeddingService(configuredEmbedder: Embedder): void {
    embedder = configuredEmbedder;
}

/**
 * Get embeddings for the given text using the configured embedder
 */
export async function getEmbedding(data: string): Promise<number[]> {
    if (!embedder) {
        throw new Error('Embedding service not initialized. Call initializeEmbeddingService first.');
    }
    return embedder.getEmbedding(data);
}