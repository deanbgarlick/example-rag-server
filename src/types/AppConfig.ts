/**
 * Required configuration keys for the application
 */
export const REQUIRED_CONFIGS = [
    'MONGODB_HOST',
    'MONGODB_USERNAME',
    'MONGODB_PASSWORD',
    'MONGODB_DB_NAME',
    'MONGODB_COLLECTION_NAME',
    'OPENAI_API_KEY'
] as const;

export type ConfigKey = typeof REQUIRED_CONFIGS[number];

/**
 * Application configuration interface
 */
export interface AppConfig {
    mongodbHost: string;
    mongodbUsername: string;
    mongodbPassword: string;
    mongodbDbName: string;
    mongodbCollectionName: string;
    openaiApiKey: string;
}

/**
 * Convert environment variable style keys to camelCase
 */
export function envToCamelCase(envKey: string): string {
    return envKey.toLowerCase()
        .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Validate required configurations are present
 */
export function validateConfig(config: Partial<AppConfig>): config is AppConfig {
    const requiredKeys = REQUIRED_CONFIGS.map(key => envToCamelCase(key.toLowerCase()));
    const missingKeys = requiredKeys.filter(key => !(key in config));
    
    if (missingKeys.length > 0) {
        throw new Error(`Missing required configuration keys: ${missingKeys.join(', ')}`);
    }
    
    return true;
}
