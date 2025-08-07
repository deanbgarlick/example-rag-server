import type { MongoConfig } from '../../types/MongoConfig';

export function getMongoConfig(): MongoConfig {
    if (!process.env.MONGODB_HOST || !process.env.MONGODB_USERNAME || !process.env.MONGODB_PASSWORD) {
        throw new Error('MongoDB credentials are required');
    }

    return {
        host: process.env.MONGODB_HOST,
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD,
        dbName: process.env.MONGODB_DB_NAME || 'rag_db',
        collectionName: process.env.MONGODB_COLLECTION_NAME || 'test'
    };
}

// Helper function to validate MongoDB configuration
export function validateMongoConfig(config: MongoConfig): void {
    if (!config.host || !config.username || !config.password) {
        throw new Error('MongoDB host, username, and password are required');
    }
}
