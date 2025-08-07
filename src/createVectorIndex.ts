import { MongoService, MongoConfig } from './services/MongoService';

interface VectorSearchIndex {
    name: string;
    type: string;
    definition: {
        fields: {
            type: string;
            path: string;
            similarity: string;
            numDimensions: number;
        }[];
    };
}

export interface VectorIndexConfig extends MongoConfig {
    indexName?: string;
    dimensions?: number;
    dropExisting?: boolean;
}

export async function createVectorIndex(config: VectorIndexConfig): Promise<string> {
    return MongoService.withClient(config, async (mongoService) => {
        const collection = mongoService.getCollection();
        
        if (config.dropExisting) {
            try {
                await collection.dropIndex(config.indexName || "vector_index");
                console.log("Dropped existing vector index");
            } catch (err) {
                // Ignore error if index doesn't exist
            }
        }
     
        const index: VectorSearchIndex = {
            name: config.indexName || "vector_index",
            type: "vectorSearch",
            definition: {
                fields: [
                    {
                        type: "vector",
                        path: "embedding",
                        similarity: "cosine",
                        numDimensions: config.dimensions || 1536 // OpenAI text-embedding-3-small uses 1536 dimensions
                    }
                ]
            }
        };

        return collection.createSearchIndex(index);
    });
}