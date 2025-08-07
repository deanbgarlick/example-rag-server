import type { MongoConfig } from './MongoConfig';

export interface VectorIndexConfig extends MongoConfig {
    indexName?: string;
    dimensions?: number;
    dropExisting?: boolean;
}