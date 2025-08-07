import { Document } from 'langchain/document';

export interface DocumentWithEmbedding {
    document: Document;
    embedding: number[];
}
