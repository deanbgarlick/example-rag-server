export interface MongoConfig {
    host: string;
    username: string;
    password: string;
    dbName?: string;
    collectionName?: string;
}