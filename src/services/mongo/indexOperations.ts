import { MongoService } from './MongoService';
import type { VectorIndexConfig } from '../../types/VectorIndexConfig';
import type { VectorSearchIndex } from '../../types/VectorSearchIndex';

/**
 * Creates a vector search index in MongoDB for similarity search operations.
 * 
 * @param config - Configuration for creating the vector index
 * @returns Promise<string> - The name of the created index
 */
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

/**
 * Lists all search indexes in the collection.
 * 
 * @param config - MongoDB configuration
 * @returns Promise<string[]> - Names of all search indexes
 */
export async function listSearchIndexes(config: VectorIndexConfig): Promise<string[]> {
    return MongoService.withClient(config, async (mongoService) => {
        const collection = mongoService.getCollection();
        const indexes = await collection.listSearchIndexes().toArray();
        return indexes.map(index => index.name);
    });
}

/**
 * Drops a search index by name.
 * 
 * @param config - MongoDB configuration
 * @param indexName - Name of the index to drop
 */
export async function dropSearchIndex(config: VectorIndexConfig, indexName: string): Promise<void> {
    return MongoService.withClient(config, async (mongoService) => {
        const collection = mongoService.getCollection();
        await collection.dropIndex(indexName);
    });
}
