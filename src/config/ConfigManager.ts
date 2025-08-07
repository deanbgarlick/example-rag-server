import { ConfigProvider } from './ConfigProvider';
import { AppConfig, REQUIRED_CONFIGS, envToCamelCase, validateConfig } from '../types/AppConfig';
import { LocalEnvProvider } from './LocalEnvProvider';
import { GcpSecretProvider } from './GcpSecretProvider';

export class ConfigManager {
    private static instance: ConfigManager | null = null;
    private static initialized = false;

    private providers: ConfigProvider[];
    private config: Partial<AppConfig>;

    private constructor(providers?: ConfigProvider[]) {
        this.providers = providers || [
            new LocalEnvProvider(),
            // Add GCP provider by default - it will auto-detect if running in GCP
            new GcpSecretProvider()
        ];
        this.config = {};
    }

    /**
     * Get the ConfigManager instance, creating it if it doesn't exist
     */
    public static getInstance(): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    /**
     * Initialize the configuration manager and load all configs
     * This should only be called once at application startup
     */
    public async init(): Promise<void> {
        if (ConfigManager.initialized) {
            console.log('ConfigManager already initialized, skipping...');
            return;
        }

        // Initialize all providers
        await Promise.all(this.providers.map(provider => provider.init()));

        // Load all required configurations
        for (const key of REQUIRED_CONFIGS) {
            // Try each provider in order until we find a value
            for (const provider of this.providers) {
                const value = await provider.get(key);
                const color = value !== undefined ? '\x1b[32m' : '\x1b[90m'; // green for found, gray for not found
                console.log(`${color}${provider.constructor.name}: ${key}: ${value}\x1b[0m`);
                if (value !== undefined) {
                    const camelKey = envToCamelCase(key.toLowerCase()) as keyof AppConfig;
                    this.config[camelKey] = value;
                    break;
                }
            }
        }

        // Validate all required configs are present
        validateConfig(this.config);
        ConfigManager.initialized = true;
    }

    /**
     * Get the complete configuration object
     * @throws Error if configuration is not initialized
     */
    public getConfig(): AppConfig {
        if (!ConfigManager.initialized) {
            throw new Error('ConfigManager not initialized. Call init() first.');
        }
        if (!validateConfig(this.config)) {
            throw new Error('Configuration is not complete');
        }
        return this.config as AppConfig;
    }

    /**
     * Get a specific configuration value
     * @throws Error if configuration is not initialized or key not found
     */
    public get<K extends keyof AppConfig>(key: K): AppConfig[K] {
        if (!ConfigManager.initialized) {
            throw new Error('ConfigManager not initialized. Call init() first.');
        }
        if (!(key in this.config)) {
            throw new Error(`Configuration key ${key} not found`);
        }
        return this.config[key] as AppConfig[K];
    }
}