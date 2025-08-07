import { MongoClient, Db, Collection } from 'mongodb';
import type { MongoConfig } from '../types/MongoConfig';

export class MongoService {
    private client: MongoClient;
    private config: MongoConfig;

    constructor(config: MongoConfig) {
        this.config = config;
        const connectionString = config.host.replace(
            'mongodb+srv://',
            `mongodb+srv://${config.username}:${config.password}@`
        );
        this.client = new MongoClient(connectionString);
    }

    async connect(): Promise<void> {
        await this.client.connect();
    }

    async disconnect(): Promise<void> {
        await this.client.close();
    }

    getDb(): Db {
        return this.client.db(this.config.dbName || "rag_db");
    }

    getCollection(): Collection {
        return this.getDb().collection(this.config.collectionName || "test");
    }

    static async withClient<T>(
        config: MongoConfig,
        operation: (service: MongoService) => Promise<T>
    ): Promise<T> {
        const service = new MongoService(config);
        try {
            await service.connect();
            return await operation(service);
        } finally {
            await service.disconnect();
        }
    }
}
