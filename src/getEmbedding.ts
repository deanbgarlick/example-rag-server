import { Embedder } from './embedders/Embedder.js';
import { OpenAIEmbedder } from './embedders/OpenAIEmbedder.js';

// Default embedder instance
const defaultEmbedder = new OpenAIEmbedder();

// Function to generate embeddings for a given data source
export async function getEmbedding(data: string, embedder: Embedder = defaultEmbedder): Promise<number[]> {
    return embedder.getEmbedding(data);
}