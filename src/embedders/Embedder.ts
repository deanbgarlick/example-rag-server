export interface Embedder {
    getEmbedding(text: string): Promise<number[]>;
}
