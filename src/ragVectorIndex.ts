import { MongoClient, Db, Collection, Document } from 'mongodb';

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

async function run(): Promise<void> {
    if (!process.env.MONGODB_HOST || !process.env.MONGODB_USERNAME || !process.env.MONGODB_PASSWORD) {
        throw new Error('MongoDB credentials are required');
    }
    
    const connectionString = process.env.MONGODB_HOST.replace(
        'mongodb+srv://',
        `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@`
    );
    
    const client: MongoClient = new MongoClient(connectionString);
    
    try {
        const database: Db = client.db("rag_db");
        const collection: Collection = database.collection("test");
        
        // Drop existing index if it exists
        try {
            await collection.dropIndex("vector_index");
            console.log("Dropped existing vector index");
        } catch (err) {
            // Ignore error if index doesn't exist
        }
     
        // Define your Atlas Vector Search index
        const index: VectorSearchIndex = {
            name: "vector_index",
            type: "vectorSearch",
            definition: {
                fields: [
                    {
                        type: "vector",
                        path: "embedding",
                        similarity: "cosine",
                        numDimensions: 1536 // OpenAI text-embedding-3-small uses 1536 dimensions
                    }
                ]
            }
        };

        // Call the method to create the index
        const result = await collection.createSearchIndex(index);
        console.log('Vector search index created:', result);
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.stack);
        } else {
            console.log('An unexpected error occurred:', err);
        }
    } finally {
        await client.close();
    }
}

run().catch(console.dir);
