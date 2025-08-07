import { InsertManyResult } from 'mongodb';
import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getEmbedding } from './getEmbedding';
import { MongoService } from './services/MongoService';
import type { DocumentWithEmbedding } from './types/DocumentWithEmbedding';
import type { MongoConfig } from './types/MongoConfig';

export async function insertDocuments(
    documents: Document[],
    config: MongoConfig
): Promise<number> {
    return MongoService.withClient(config, async (mongoService) => {
        const collection = mongoService.getCollection();
        
        console.log("Generating embeddings and inserting documents...");
        const insertDocuments: DocumentWithEmbedding[] = [];

        await Promise.all(documents.map(async (doc: Document) => {
            const embedding: number[] = await getEmbedding(doc.pageContent);
            insertDocuments.push({
                document: doc,
                embedding: embedding
            });
        }));

        const options = { ordered: false };
        const result: InsertManyResult<DocumentWithEmbedding> = 
            await collection.insertMany(insertDocuments, options);
            
        return result.insertedCount;
    });
}

export async function splitDocuments(docs: Document[]): Promise<Document[]> {
    const textSplitter: RecursiveCharacterTextSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 400,
        chunkOverlap: 20,
    });

    return textSplitter.splitDocuments(docs);
}