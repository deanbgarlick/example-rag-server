/**
 * Interface for configuration providers
 */
export interface ConfigProvider {
    /**
     * Get a configuration value by key
     * @param key The configuration key to fetch
     * @returns Promise resolving to the configuration value or undefined if not found
     */
    get(key: string): Promise<string | undefined>;

    /**
     * Initialize the configuration provider
     * @returns Promise resolving when initialization is complete
     */
    init(): Promise<void>;
}