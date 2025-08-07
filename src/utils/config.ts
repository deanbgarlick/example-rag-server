import { MongoConfig } from '../services/MongoService';

export function getMongoConfig(): MongoConfig {
    if (!process.env.MONGODB_HOST || !process.env.MONGODB_USERNAME || !process.env.MONGODB_PASSWORD) {
        throw new Error('MongoDB credentials are required');
    }

    return {
        host: process.env.MONGODB_HOST,
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD,
        dbName: "rag_db",
        collectionName: "test"
    };
}
