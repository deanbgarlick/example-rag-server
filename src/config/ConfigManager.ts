import { ConfigProvider } from './ConfigProvider';
import { AppConfig, REQUIRED_CONFIGS, envToCamelCase, validateConfig } from '../types/AppConfig';
import { LocalEnvProvider } from './LocalEnvProvider';
import { GcpSecretProvider } from './GcpSecretProvider';

export class ConfigManager {
    private providers: ConfigProvider[];
    private config: Partial<AppConfig>;

    constructor(providers?: ConfigProvider[]) {
        this.providers = providers || [
            new LocalEnvProvider(),
            // Add GCP provider by default - it will auto-detect if running in GCP
            new GcpSecretProvider()
        ];
        this.config = {};
    }

    /**
     * Initialize all configuration providers and load configurations
     */
    async init(): Promise<void> {
        // Initialize all providers
        await Promise.all(this.providers.map(provider => provider.init()));

        // Load all required configurations
        for (const key of REQUIRED_CONFIGS) {
            // Try each provider in order until we find a value
            for (const provider of this.providers) {
                const value = await provider.get(key);
                if (value !== undefined) {
                    const camelKey = envToCamelCase(key.toLowerCase()) as keyof AppConfig;
                    this.config[camelKey] = value;
                    break;
                }
            }
        }

        // Validate all required configs are present
        validateConfig(this.config);
    }

    /**
     * Get the complete configuration object
     */
    getConfig(): AppConfig {
        if (!validateConfig(this.config)) {
            throw new Error('Configuration is not complete');
        }
        return this.config as AppConfig;
    }

    /**
     * Get a specific configuration value
     */
    get<K extends keyof AppConfig>(key: K): AppConfig[K] {
        if (!(key in this.config)) {
            throw new Error(`Configuration key ${key} not found`);
        }
        return this.config[key] as AppConfig[K];
    }
}
