import { createVectorIndex } from '../src/services/mongo/indexOperations';
import type { VectorIndexConfig } from '../src/types/VectorIndexConfig';

async function run(): Promise<void> {
    if (!process.env.MONGODB_HOST || !process.env.MONGODB_USERNAME || !process.env.MONGODB_PASSWORD) {
        throw new Error('MongoDB credentials are required');
    }

    const config: VectorIndexConfig = {
        host: process.env.MONGODB_HOST,
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD,
        dropExisting: true,
        dimensions: 1536 // OpenAI text-embedding-3-small dimensions
    };
    
    try {
        const result = await createVectorIndex(config);
        console.log('Vector search index created:', result);
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.stack);
        } else {
            console.log('An unexpected error occurred:', err);
        }
    }
}

run().catch(console.dir);