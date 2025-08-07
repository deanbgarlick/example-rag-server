import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { ConfigProvider } from './ConfigProvider';

/**
 * Configuration provider that reads from GCP Secret Manager
 */
export class GcpSecretProvider implements ConfigProvider {
    private client: SecretManagerServiceClient;
    private projectId: string;
    private cache: Map<string, string>;

    constructor(projectId?: string) {
        this.client = new SecretManagerServiceClient();
        this.cache = new Map();
        // If projectId is not provided, the client library will automatically
        // detect it from the environment or metadata server
        this.projectId = projectId || '';
    }

    private async getProjectId(): Promise<string> {
        if (!this.projectId) {
            // Get project ID from client library's auto-detection
            this.projectId = await this.client.getProjectId();
        }
        return this.projectId;
    }

    async init(): Promise<void> {
        // Initialization is handled in constructor
        // This could be used to pre-fetch secrets if needed
    }

    async get(key: string): Promise<string | undefined> {
        // Check cache first
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }

        try {
            // Format the secret name
            const projectId = await this.getProjectId();
            const name = `projects/${projectId}/secrets/${key}/versions/latest`;

            // Access the secret version
            const [version] = await this.client.accessSecretVersion({
                name: name,
            });

            if (!version.payload?.data) {
                return undefined;
            }

            const value = version.payload.data.toString();
            
            // Cache the result
            this.cache.set(key, value);
            
            return value;
        } catch (error) {
            console.warn(`Failed to fetch secret ${key}:`, error);
            return undefined;
        }
    }
}
