import { MongoClient, Db, Collection, Document } from 'mongodb';
import { getEmbedding } from './getEmbedding';

interface QueryDocument {
    document: {
        pageContent: string;
    };
}

// Function to get the results of a vector query
export async function getQueryResults(query: string): Promise<QueryDocument[]> {
    // Connect to your Atlas cluster
    if (!process.env.MONGODB_HOST || !process.env.MONGODB_USERNAME || !process.env.MONGODB_PASSWORD) {
        throw new Error('MongoDB credentials are required');
    }
    
    const connectionString = process.env.MONGODB_HOST.replace(
        'mongodb+srv://',
        `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@`
    );
    
    const client: MongoClient = new MongoClient(connectionString);
    
    try {
        // Get embedding for a query
        const queryEmbedding: number[] = await getEmbedding(query);
        await client.connect();
        
        const db: Db = client.db("rag_db");
        const collection: Collection = db.collection("test");
        
        const pipeline = [
            {
                $vectorSearch: {
                    index: "vector_index",
                    queryVector: queryEmbedding,
                    path: "embedding",
                    exact: true,
                    limit: 5
                }
            },
            {
                $project: {
                    _id: 0,
                    document: 1,
                }
            }
        ];

        // Retrieve documents from Atlas using this Vector Search query
        const result = collection.aggregate(pipeline);
        const arrayOfQueryDocs: QueryDocument[] = [];
        
        for await (const doc of result) {
            arrayOfQueryDocs.push(doc as QueryDocument);
        }
        
        return arrayOfQueryDocs;
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.stack);
        } else {
            console.log('An unexpected error occurred:', err);
        }
        // Return empty array in case of error to maintain type safety
        return [];
    } finally {
        await client.close();
    }
}
